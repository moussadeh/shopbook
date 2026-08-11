import "server-only";

import prisma from "@/prisma/prisma";
import { getUtilisateurActuel } from "@/lib/auth/auth";
import { StatutCommande, StatutPaiementCommande, ModeCommande } from "@/app/generated/prisma/client";

const num = (d: unknown) => Number(d ?? 0);

export type MaCommandeLigne = { nom: string; prixUnitaire: number; quantite: number; total: number };

export type MaCommande = {
  id: number;
  boutiqueNom: string;
  boutiqueSlug: string | null;
  mode: ModeCommande;
  adresse: string;
  statut: StatutCommande;
  statutPaiement: StatutPaiementCommande;
  total: number;
  date: string;
  lignes: MaCommandeLigne[];
};

const fmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
});

export async function getMesCommandes(): Promise<MaCommande[] | null> {
  const utilisateur = await getUtilisateurActuel();
  if (!utilisateur?.client) return null; // pas connecté ou pas de profil client

  const rows = await prisma.commande.findMany({
    where: { clientId: utilisateur.client.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, mode: true, adresseLivraison: true,
      statutCommande: true, statutPaiement: true, montantTotal: true, createdAt: true,
      boutique: { select: { nom: true, slug: true } },
      lignes: { select: { nomProduit: true, prixUnitaire: true, quantite: true, total: true } },
    },
  });

  return rows.map((c) => ({
    id: c.id,
    boutiqueNom: c.boutique?.nom ?? "Boutique",
    boutiqueSlug: c.boutique?.slug ?? null,
    mode: c.mode,
    adresse: c.adresseLivraison ?? "",
    statut: c.statutCommande,
    statutPaiement: c.statutPaiement,
    total: num(c.montantTotal),
    date: fmt.format(c.createdAt),
    lignes: c.lignes.map((l) => ({
      nom: l.nomProduit,
      prixUnitaire: num(l.prixUnitaire),
      quantite: l.quantite,
      total: num(l.total),
    })),
  }));
}