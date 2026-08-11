import "server-only";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { StatutCommande, StatutPaiementCommande, ModeCommande } from "@/app/generated/prisma/client";

const num = (d: unknown) => Number(d ?? 0);

export type LigneCommandeRow = { nom: string; prixUnitaire: number; quantite: number; total: number };

export type CommandeRow = {
  id: number;
  clientNom: string;
  clientTel: string;
  initials: string;
  mode: ModeCommande;
  adresse: string;
  commentaire: string;
  statut: StatutCommande;
  statutPaiement: StatutPaiementCommande;
  total: number;
  nbArticles: number;
  date: string;
  lignes: LigneCommandeRow[];
};

const fmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
});

const ordreStatut: Record<StatutCommande, number> = {
  NOUVELLE: 0, EN_PREPARATION: 1, PRETE: 2, EN_LIVRAISON: 2,
  RECUPEREE: 5, LIVREE: 5, REFUSEE: 6, ANNULEE: 6,
};

/** boutique du commerçant connecté, ou null */
export async function getBoutiqueId(): Promise<number | null> {
  const commercantId = await exigerCommercant();
  const b = await prisma.boutique.findUnique({
    where: { commercantId },
    select: { id: true },
  });
  return b?.id ?? null;
}

export async function getCommandes(): Promise<CommandeRow[]> {
  const boutiqueId = await getBoutiqueId();
  if (!boutiqueId) return [];

  const rows = await prisma.commande.findMany({
    where: { boutiqueId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, mode: true, adresseLivraison: true, commentaire: true,
      statutCommande: true, statutPaiement: true, montantTotal: true, createdAt: true,
      nomDestinataire: true, telephoneDestinataire: true,
      lignes: { select: { nomProduit: true, prixUnitaire: true, quantite: true, total: true } },
    },
  });

  const mapped = rows.map((c) => {
    const nom = c.nomDestinataire;
    return {
      id: c.id,
      clientNom: nom,
      clientTel: c.telephoneDestinataire,
      initials: nom.split(" ").map((m) => m[0] ?? "").join("").slice(0, 2).toUpperCase(),
      mode: c.mode,
      adresse: c.adresseLivraison ?? "",
      commentaire: c.commentaire ?? "",
      statut: c.statutCommande,
      statutPaiement: c.statutPaiement,
      total: num(c.montantTotal),
      nbArticles: c.lignes.reduce((s, l) => s + l.quantite, 0),
      date: fmt.format(c.createdAt),
      lignes: c.lignes.map((l) => ({
        nom: l.nomProduit,
        prixUnitaire: num(l.prixUnitaire),
        quantite: l.quantite,
        total: num(l.total),
      })),
    };
  });

  return mapped.sort((a, b) => ordreStatut[a.statut] - ordreStatut[b.statut]);
}

export type CommandesStats = {
  nouvelles: number;
  enCours: number;
  aEncaisser: number;
  terminees: number;
};

export async function getCommandesStats(): Promise<CommandesStats> {
  const boutiqueId = await getBoutiqueId();
  if (!boutiqueId) return { nouvelles: 0, enCours: 0, aEncaisser: 0, terminees: 0 };

  const [nouvelles, enCours, aEncaisser, terminees] = await Promise.all([
    prisma.commande.count({ where: { boutiqueId, statutCommande: StatutCommande.NOUVELLE } }),
    prisma.commande.count({ where: { boutiqueId, statutCommande: { in: [StatutCommande.EN_PREPARATION, StatutCommande.PRETE, StatutCommande.EN_LIVRAISON] } } }),
    prisma.commande.count({ where: { boutiqueId, statutPaiement: StatutPaiementCommande.EN_ATTENTE, statutCommande: { in: [StatutCommande.RECUPEREE, StatutCommande.LIVREE] } } }),
    prisma.commande.count({ where: { boutiqueId, statutCommande: { in: [StatutCommande.RECUPEREE, StatutCommande.LIVREE] } } }),
  ]);

  return { nouvelles, enCours, aEncaisser, terminees };
}