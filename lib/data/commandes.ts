import "server-only";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { StatutCommande, StatutPaiementCommande, ModeCommande } from "@/app/generated/prisma/enums";

export type LigneCommandeRow = { nom: string; prixUnitaire: number; quantite: number };

export type CommandeRow = {
  id: number;
  acheteurNom: string;
  acheteurTel: string;
  initials: string;
  mode: ModeCommande;
  adresse: string;
  note: string;
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

// ordre d'affichage : nouvelles/en cours d'abord, terminées en bas
const ordreStatut: Record<StatutCommande, number> = {
  NOUVELLE: 0, EN_PREPARATION: 1, PRETE: 2, EN_LIVRAISON: 2,
  RECUPEREE: 5, LIVREE: 5, REFUSEE: 6, ANNULEE: 6,
};

export async function getCommandes(): Promise<CommandeRow[]> {
  const commercantId = await getCommercantId();

  const rows = await prisma.commande.findMany({
    where: { commercantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, mode: true, adresse: true, note: true,
      statut: true, statutPaiement: true, total: true, createdAt: true,
      acheteur: { select: { nom: true, telephone: true } },
      lignes: { select: { nomProduit: true, prixUnitaire: true, quantite: true } },
    },
  });

  const mapped = rows.map((c) => {
    const nom = c.acheteur.nom;
    return {
      id: c.id,
      acheteurNom: nom,
      acheteurTel: c.acheteur.telephone,
      initials: nom.split(" ").map((m) => m[0] ?? "").join("").slice(0, 2).toUpperCase(),
      mode: c.mode,
      adresse: c.adresse ?? "",
      note: c.note ?? "",
      statut: c.statut,
      statutPaiement: c.statutPaiement,
      total: c.total,
      nbArticles: c.lignes.reduce((s, l) => s + l.quantite, 0),
      date: fmt.format(c.createdAt),
      lignes: c.lignes.map((l) => ({ nom: l.nomProduit, prixUnitaire: l.prixUnitaire, quantite: l.quantite })),
    };
  });

  // tri : par état (actives d'abord) puis récence
  return mapped.sort((a, b) => ordreStatut[a.statut] - ordreStatut[b.statut]);
}

export type CommandesStats = {
  nouvelles: number;
  enCours: number;
  aEncaisser: number;   // commandes remises mais pas encore payées
  terminees: number;
};

export async function getCommandesStats(): Promise<CommandesStats> {
  const commercantId = await getCommercantId();

  const [nouvelles, enCours, aEncaisser, terminees] = await Promise.all([
    prisma.commande.count({ where: { commercantId, statut: StatutCommande.NOUVELLE } }),
    prisma.commande.count({ where: { commercantId, statut: { in: [StatutCommande.EN_PREPARATION, StatutCommande.PRETE, StatutCommande.EN_LIVRAISON] } } }),
    prisma.commande.count({ where: { commercantId, statutPaiement: StatutPaiementCommande.EN_ATTENTE, statut: { in: [StatutCommande.RECUPEREE, StatutCommande.LIVREE] } } }),
    prisma.commande.count({ where: { commercantId, statut: { in: [StatutCommande.RECUPEREE, StatutCommande.LIVREE] } } }),
  ]);

  return { nouvelles, enCours, aEncaisser, terminees };
}