"use server";

import prisma from "@/prisma/prisma";
import { getAcheteurId } from "@/lib/auth/acheteur";
import { ModeCommande } from "@/app/generated/prisma/client";

export type CommandeState = { error?: string; commandeId?: number };

type LigneInput = { produitId: number; qte: number };

export async function passerCommande(input: {
  slug: string;
  mode: "LIVRAISON" | "RETRAIT";
  adresse?: string;
  note?: string;
  lignes: LigneInput[];
}): Promise<CommandeState> {
  const acheteurId = await getAcheteurId();
  if (!acheteurId) return { error: "Vous devez être connecté pour commander." };

  if (input.lignes.length === 0) return { error: "Votre panier est vide." };
  if (input.mode === "LIVRAISON" && !input.adresse?.trim())
    return { error: "L'adresse de livraison est requise." };

  // Retrouver la boutique + son commerçant
  const boutique = await prisma.boutique.findUnique({
    where: { slug: input.slug },
    select: { commercantId: true, active: true, livraison: true, retrait: true },
  });
  if (!boutique || !boutique.active) return { error: "Cette boutique n'est pas disponible." };
  if (input.mode === "LIVRAISON" && !boutique.livraison) return { error: "La livraison n'est pas proposée." };
  if (input.mode === "RETRAIT" && !boutique.retrait) return { error: "Le retrait n'est pas proposé." };

  // Recharger les produits depuis la BDD (on ne fait JAMAIS confiance aux prix venus du client)
  const ids = input.lignes.map((l) => l.produitId);
  const produits = await prisma.produit.findMany({
    where: { id: { in: ids }, commercantId: boutique.commercantId, disponible: true },
    select: { id: true, nom: true, prix: true },
  });

  const lignesValides = input.lignes
    .map((l) => {
      const p = produits.find((x) => x.id === l.produitId);
      if (!p || l.qte <= 0) return null;
      return { produitId: p.id, nomProduit: p.nom, prixUnitaire: p.prix, quantite: l.qte };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  if (lignesValides.length === 0) return { error: "Aucun produit valide dans le panier." };

  const total = lignesValides.reduce((s, l) => s + l.prixUnitaire * l.quantite, 0);

  const commande = await prisma.commande.create({
    data: {
      acheteurId,
      commercantId: boutique.commercantId,
      mode: input.mode as ModeCommande,
      adresse: input.mode === "LIVRAISON" ? input.adresse!.trim() : null,
      note: input.note?.trim() || null,
      total,
      lignes: { create: lignesValides },
    },
    select: { id: true },
  });

  return { commandeId: commande.id };
}