import "server-only";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";

export type EmprunteurRow = {
  id: number;
  prenom: string;
  nom: string;
  name: string;
  initials: string;
  telephone: string;
  creditCount: number;
  creditTotal: string;
  statut: string;  // "Non payé" | "En cours" | "Payé"
  lastActivity: string;
};

const fmtDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric",
});

const num = (d: unknown) => Number(d ?? 0);
const formatMontant = (n: number) => `${n.toLocaleString("fr-FR")} MRU`;

// Statut global déduit des montants, pas des statuts individuels
function computeStatut(total: number, paye: number, nbCredits: number): string {
  if (nbCredits === 0) return "Payé";
  if (paye >= total) return "Payé";
  if (paye <= 0) return "Non payé";
  return "En cours";
}

export async function getEmprunteurs(): Promise<EmprunteurRow[]> {
  const commercantId = await exigerCommercant();

  const rows = await prisma.emprunteur.findMany({
    where: { commercantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, prenom: true, nom: true, telephone: true, createdAt: true,
      credits: {
        select: { montantTotal: true, montantPaye: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return rows.map((e) => {
    const total = e.credits.reduce((s, c) => s + num(c.montantTotal), 0);
    const paye = e.credits.reduce((s, c) => s + num(c.montantPaye), 0);

    return {
      id: e.id,
      prenom: e.prenom,
      nom: e.nom,
      name: `${e.prenom} ${e.nom}`,
      initials: `${e.prenom[0] ?? ""}${e.nom[0] ?? ""}`.toUpperCase(),
      telephone: e.telephone ?? "",
      creditCount: e.credits.length,
      creditTotal: formatMontant(total - paye),
      statut: computeStatut(total, paye, e.credits.length),
      lastActivity: fmtDate.format(e.credits[0]?.updatedAt ?? e.createdAt),
    };
  });
}

export type EmprunteursStats = {
  total: number;
  avecCredits: number;
  nouveauxCeMois: number;
  totalEncours: number;
};

export async function getEmprunteursStats(): Promise<EmprunteursStats> {
  const commercantId = await exigerCommercant();

  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, avecCredits, nouveauxCeMois, encours] = await Promise.all([
    prisma.emprunteur.count({ where: { commercantId } }),
    prisma.emprunteur.count({ where: { commercantId, credits: { some: {} } } }),
    prisma.emprunteur.count({ where: { commercantId, createdAt: { gte: debutMois } } }),
    prisma.credit.aggregate({
      where: { commercantId },
      _sum: { montantTotal: true, montantPaye: true },
    }),
  ]);

  return {
    total,
    avecCredits,
    nouveauxCeMois,
    totalEncours: num(encours._sum.montantTotal) - num(encours._sum.montantPaye),
  };
}