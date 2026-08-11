import "server-only";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { StatutCredit } from "@/app/generated/prisma/client";

const num = (d: unknown) => Number(d ?? 0);

export type CreditRow = {
  id: number;
  emprunteurId: number;
  emprunteurNom: string;
  emprunteurInitiales: string;
  description: string;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  statut: StatutCredit;
  date: string;
};

export type EmprunteurCreditRow = {
  emprunteurId: number;
  emprunteurNom: string;
  emprunteurInitiales: string;
  nbCredits: number;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  statutGlobal: StatutCredit;
  derniereActivite: string;
  credits: CreditRow[];
};

export type EmprunteurOption = { id: number; name: string };

const fmtDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function statutGlobal(credits: { montantTotal: number; montantPaye: number }[]): StatutCredit {
  const total = credits.reduce((s, c) => s + c.montantTotal, 0);
  const paye  = credits.reduce((s, c) => s + c.montantPaye, 0);

  if (paye >= total) return StatutCredit.PAYE;
  if (paye <= 0)     return StatutCredit.NON_PAYE;
  return StatutCredit.EN_COURS;
}

export async function getCredits(): Promise<EmprunteurCreditRow[]> {
  const commercantId = await exigerCommercant();

  const rows = await prisma.credit.findMany({
    where: { commercantId },
    orderBy: { dateCredit: "desc" },
    select: {
      id: true,
      emprunteurId: true,
      description: true,
      montantTotal: true,
      montantPaye: true,
      statutCredit: true,
      dateCredit: true,
      emprunteur: { select: { prenom: true, nom: true } },
    },
  });

  const details: (CreditRow & { _date: Date })[] = rows.map((c) => {
    const total = num(c.montantTotal);
    const paye  = num(c.montantPaye);
    return {
      id: c.id,
      emprunteurId: c.emprunteurId,
      emprunteurNom: `${c.emprunteur.prenom} ${c.emprunteur.nom}`,
      emprunteurInitiales: `${c.emprunteur.prenom[0] ?? ""}${c.emprunteur.nom[0] ?? ""}`.toUpperCase(),
      description: c.description ?? "",
      montantTotal: total,
      montantPaye: paye,
      montantRestant: total - paye,
      statut: c.statutCredit,
      date: fmtDate.format(c.dateCredit),
      _date: c.dateCredit,
    };
  });

  // Regroupe par emprunteur (l'ordre d'insertion suit le tri par date desc)
  const parEmprunteur = new Map<number, (CreditRow & { _date: Date })[]>();
  for (const credit of details) {
    const liste = parEmprunteur.get(credit.emprunteurId) ?? [];
    liste.push(credit);
    parEmprunteur.set(credit.emprunteurId, liste);
  }

  const lignes: EmprunteurCreditRow[] = [];
  for (const [emprunteurId, credits] of parEmprunteur) {
    const premier = credits[0];
    const montantTotal = credits.reduce((s, c) => s + c.montantTotal, 0);
    const montantPaye  = credits.reduce((s, c) => s + c.montantPaye, 0);

    lignes.push({
      emprunteurId,
      emprunteurNom: premier.emprunteurNom,
      emprunteurInitiales: premier.emprunteurInitiales,
      nbCredits: credits.length,
      montantTotal,
      montantPaye,
      montantRestant: montantTotal - montantPaye,
      statutGlobal: statutGlobal(credits),
      derniereActivite: premier.date,
      credits: credits.map(({ _date, ...rest }) => rest),
    });
  }

  return lignes;
}

export async function getEmprunteursOptions(): Promise<EmprunteurOption[]> {
  const commercantId = await exigerCommercant();
  const emprunteurs = await prisma.emprunteur.findMany({
    where: { commercantId },
    orderBy: [{ prenom: "asc" }, { nom: "asc" }],
    select: { id: true, prenom: true, nom: true },
  });
  return emprunteurs.map((e) => ({ id: e.id, name: `${e.prenom} ${e.nom}` }));
}

export type CreditsStats = {
  creditsActifs: number;
  encoursTotal: number;
  encaisseCeMois: number;
  creditsSoldes: number;
};

export async function getCreditsStats(): Promise<CreditsStats> {
  const commercantId = await exigerCommercant();
  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

  const [creditsActifs, creditsSoldes, encours, paiementsMois] = await Promise.all([
    prisma.credit.count({ where: { commercantId, statutCredit: { not: StatutCredit.PAYE } } }),
    prisma.credit.count({ where: { commercantId, statutCredit: StatutCredit.PAYE } }),
    prisma.credit.aggregate({
      where: { commercantId, statutCredit: { not: StatutCredit.PAYE } },
      _sum: { montantTotal: true, montantPaye: true },
    }),
    prisma.paiement.aggregate({
      where: { credit: { commercantId }, datePaiement: { gte: debutMois } },
      _sum: { montant: true },
    }),
  ]);

  return {
    creditsActifs,
    encoursTotal: num(encours._sum.montantTotal) - num(encours._sum.montantPaye),
    encaisseCeMois: num(paiementsMois._sum.montant),
    creditsSoldes,
  };
}