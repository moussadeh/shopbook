import "server-only";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { StatutCredit } from "@/app/generated/prisma/client";

const num = (d: unknown) => Number(d ?? 0);

export type DashboardStats = {
  totalEmprunteurs: number;
  encoursTotal: number;
  encaisseCeMois: number;
  creditsActifs: number;
};

export type ActivityItem = {
  id: string;
  type: "payment" | "credit" | "new_client";
  name: string;
  date: string;
  amount: string;
  amountPositive: boolean;
};

export type DonutSegment = {
  cle: "paye" | "restant";
  label: string;
  montant: number;
  pct: number;
};

export type DashboardData = {
  stats: DashboardStats;
  activities: ActivityItem[];
  distribution: { segments: DonutSegment[]; total: number };
};

const fmtMRU = (n: number) => `${n.toLocaleString("fr-FR")} MRU`;

function tempsEcoule(date: Date): string {
  const min = Math.floor((Date.now() - date.getTime()) / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j < 30) return `Il y a ${j} j`;
  return `Il y a ${Math.floor(j / 30)} mois`;
}

export async function getDashboardData(): Promise<DashboardData> {
  const commercantId = await exigerCommercant();
  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalEmprunteurs, creditsActifs, encours, paiementsMois,
    recentPaiements, recentCredits, recentEmprunteurs, distributionRaw,
  ] = await Promise.all([
    prisma.emprunteur.count({ where: { commercantId } }),
    prisma.credit.count({ where: { commercantId, statutCredit: { not: StatutCredit.PAYE } } }),
    prisma.credit.aggregate({
      where: { commercantId, statutCredit: { not: StatutCredit.PAYE } },
      _sum: { montantTotal: true, montantPaye: true },
    }),
    prisma.paiement.aggregate({
      where: { credit: { commercantId }, datePaiement: { gte: debutMois } },
      _sum: { montant: true },
    }),
    prisma.paiement.findMany({
      where: { credit: { commercantId } },
      orderBy: { datePaiement: "desc" }, take: 6,
      select: {
        id: true, montant: true, datePaiement: true,
        credit: { select: { emprunteur: { select: { prenom: true, nom: true } } } },
      },
    }),
    prisma.credit.findMany({
      where: { commercantId },
      orderBy: { dateCredit: "desc" }, take: 6,
      select: {
        id: true, montantTotal: true, dateCredit: true,
        emprunteur: { select: { prenom: true, nom: true } },
      },
    }),
    prisma.emprunteur.findMany({
      where: { commercantId },
      orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, prenom: true, nom: true, createdAt: true },
    }),
    prisma.credit.aggregate({
      where: { commercantId },
      _sum: { montantTotal: true, montantPaye: true },
    }),
  ]);

  const stats: DashboardStats = {
    totalEmprunteurs,
    encoursTotal: num(encours._sum.montantTotal) - num(encours._sum.montantPaye),
    encaisseCeMois: num(paiementsMois._sum.montant),
    creditsActifs,
  };

  // --- activité (fusion + tri) ---
  const acts: (ActivityItem & { _d: Date })[] = [
    ...recentPaiements.map((p) => ({
      id: `p${p.id}`, type: "payment" as const,
      name: `${p.credit.emprunteur.prenom} ${p.credit.emprunteur.nom}`,
      _d: p.datePaiement, date: tempsEcoule(p.datePaiement),
      amount: `+${fmtMRU(num(p.montant))}`, amountPositive: true,
    })),
    ...recentCredits.map((c) => ({
      id: `c${c.id}`, type: "credit" as const,
      name: `${c.emprunteur.prenom} ${c.emprunteur.nom}`,
      _d: c.dateCredit, date: tempsEcoule(c.dateCredit),
      amount: `+${fmtMRU(num(c.montantTotal))}`, amountPositive: true,
    })),
    ...recentEmprunteurs.map((e) => ({
      id: `e${e.id}`, type: "new_client" as const,
      name: `${e.prenom} ${e.nom}`,
      _d: e.createdAt, date: tempsEcoule(e.createdAt),
      amount: "", amountPositive: true,
    })),
  ];
  acts.sort((a, b) => b._d.getTime() - a._d.getTime());
  const activities: ActivityItem[] = acts.slice(0, 6).map(({ _d, ...rest }) => rest);

  // --- donut : encaissé vs restant à récupérer ---
  const totalCredits = num(distributionRaw._sum.montantTotal);
  const totalPaye    = num(distributionRaw._sum.montantPaye);
  const totalRestant = totalCredits - totalPaye;
  const pct = (v: number) => (totalCredits > 0 ? Math.round((v / totalCredits) * 100) : 0);

  const segments: DonutSegment[] = [
    { cle: "paye",    label: "Encaissé",      montant: totalPaye,    pct: pct(totalPaye) },
    { cle: "restant", label: "À récupérer",   montant: totalRestant, pct: pct(totalRestant) },
  ];

  return { stats, activities, distribution: { segments, total: totalCredits } };
}