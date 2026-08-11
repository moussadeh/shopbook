"use server";

import prisma from "@/prisma/prisma";
import { getUtilisateurActuel, exigerClient } from "@/lib/auth/auth";
import { ModeCommande } from "@/app/generated/prisma/client";

const num = (d: unknown) => Number(d ?? 0);

export type CommandeState = { error?: string; commandeId?: number };

type LigneInput = { produitId: number; qte: number };

export async function passerCommande(input: {
  slug: string;
  mode: "LIVRAISON" | "RETRAIT";
  adresse?: string;
  commentaire?: string;
  lignes: LigneInput[];
}): Promise<CommandeState> {
  const utilisateur = await getUtilisateurActuel();
  if (!utilisateur) return { error: "Vous devez être connecté pour commander." };

  if (input.lignes.length === 0) return { error: "Votre panier est vide." };
  if (input.mode === "LIVRAISON" && !input.adresse?.trim())
    return { error: "L'adresse de livraison est requise." };

  const boutique = await prisma.boutique.findUnique({
    where: { slug: input.slug },
    select: {
      id: true, estActive: true, livraisonDisponible: true, retraitDisponible: true, commercant: { select: { utilisateurId: true } }
    },
  });
  if (!boutique || !boutique.estActive) return { error: "Cette boutique n'est pas disponible." };

  // On ne commande pas sur sa propre boutique
  if (boutique.commercant.utilisateurId === utilisateur.id) {
    return { error: "Vous êtes le propriétaire de cette boutique, vous ne pouvez pas y commander." };
  }

  if (input.mode === "LIVRAISON" && !boutique.livraisonDisponible) return { error: "La livraison n'est pas proposée." };
  if (input.mode === "RETRAIT" && !boutique.retraitDisponible) return { error: "Le retrait n'est pas proposé." };

  // Recharger les produits depuis la BDD — jamais confiance aux prix du client
  const ids = input.lignes.map((l) => l.produitId);
  const produits = await prisma.produit.findMany({
    where: { id: { in: ids }, boutiqueId: boutique.id, disponible: true },
    select: { id: true, nom: true, prix: true },
  });

  const lignesValides = input.lignes
    .map((l) => {
      const p = produits.find((x) => x.id === l.produitId);
      if (!p || l.qte <= 0) return null;
      const prix = num(p.prix);
      return {
        produitId: p.id,
        nomProduit: p.nom,
        prixUnitaire: prix,
        quantite: l.qte,
        total: prix * l.qte,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  if (lignesValides.length === 0) return { error: "Aucun produit valide dans le panier." };

  const montantTotal = lignesValides.reduce((s, l) => s + l.total, 0);

  // Profil client (créé à la volée si l'utilisateur n'en a pas encore)
  const clientId = await exigerClient();

  const commande = await prisma.commande.create({
    data: {
      clientId,
      boutiqueId: boutique.id,
      mode: input.mode as ModeCommande,
      adresseLivraison: input.mode === "LIVRAISON" ? input.adresse!.trim() : null,
      commentaire: input.commentaire?.trim() || null,
      nomDestinataire: `${utilisateur.prenom} ${utilisateur.nom}`,
      telephoneDestinataire: utilisateur.telephone,
      montantTotal,
      lignes: { create: lignesValides },
    },
    select: { id: true },
  });

  return { commandeId: commande.id };
}