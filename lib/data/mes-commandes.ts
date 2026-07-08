import "server-only";

import prisma from "@/prisma/prisma";
import { getAcheteurId } from "@/lib/auth/acheteur";
import { StatutCommande, StatutPaiementCommande, ModeCommande } from "@/app/generated/prisma/client";

export type MaCommandeLigne = { nom: string; prixUnitaire: number; quantite: number };

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
  const acheteurId = await getAcheteurId();
  if (!acheteurId) return null; // non connecté

  const rows = await prisma.commande.findMany({
    where: { acheteurId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, mode: true, adresse: true, statut: true, statutPaiement: true,
      total: true, createdAt: true,
      commercant: { select: { boutique: { select: { nom: true, slug: true } } } },
      lignes: { select: { nomProduit: true, prixUnitaire: true, quantite: true } },
    },
  });

  return rows.map((c) => ({
    id: c.id,
    boutiqueNom: c.commercant.boutique?.nom ?? "Boutique",
    boutiqueSlug: c.commercant.boutique?.slug ?? null,
    mode: c.mode,
    adresse: c.adresse ?? "",
    statut: c.statut,
    statutPaiement: c.statutPaiement,
    total: c.total,
    date: fmt.format(c.createdAt),
    lignes: c.lignes.map((l) => ({ nom: l.nomProduit, prixUnitaire: l.prixUnitaire, quantite: l.quantite })),
  }));
}