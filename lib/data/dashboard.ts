import "server-only";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { StatutCredit } from "@/app/generated/prisma/client";

export type DashboardStats = {
  totalClients: number;
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

export type DonutSegment = { statut: StatutCredit; montant: number; pct: number };

export type TopClient = {
  id: number; name: string; initials: string;
  creditTotal: number; statut: StatutCredit; lastActivity: string;
};

export type TopProduit = { id: number; nom: string; vendu: number; prixUnitaire: number };

export type DashboardData = {
  stats: DashboardStats;
  activities: ActivityItem[];
  distribution: { segments: DonutSegment[]; total: number };
  topClients: TopClient[];
  topProduits: TopProduit[];
};

const fmtDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
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
  const commercantId = await getCommercantId();
  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalClients, creditsActifs, encours, paiementsMois,
    recentPaiements, recentCredits, recentClients,
    distributionRaw, clientsAvecCredits,
  ] = await Promise.all([
    prisma.client.count({ where: { commercantId } }),
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
      select: { id: true, montant: true, datePaiement: true,
        credit: { select: { client: { select: { prenom: true, nom: true } } } } },
    }),
    prisma.credit.findMany({
      where: { commercantId },
      orderBy: { dateCredit: "desc" }, take: 6,
      select: { id: true, montantTotal: true, dateCredit: true,
        client: { select: { prenom: true, nom: true } } },
    }),
    prisma.client.findMany({
      where: { commercantId },
      orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, prenom: true, nom: true, createdAt: true },
    }),
    prisma.credit.groupBy({
      by: ["statutCredit"], where: { commercantId }, _sum: { montantTotal: true },
    }),
    prisma.client.findMany({
      where: { commercantId, credits: { some: {} } },
      select: { id: true, prenom: true, nom: true,
        credits: { select: { montantTotal: true, montantPaye: true, statutCredit: true, updatedAt: true },
          orderBy: { updatedAt: "desc" } } },
    }),
    // prisma.produit.findMany({
    //   where: { commercantId },
    //   select: { id: true, nom: true, prixUnitaire: true, credits: { select: { quantite: true } } },
    // }),
  ]);

  // --- stats ---
  const stats: DashboardStats = {
    totalClients,
    encoursTotal: (encours._sum.montantTotal ?? 0) - (encours._sum.montantPaye ?? 0),
    encaisseCeMois: paiementsMois._sum.montant ?? 0,
    creditsActifs,
  };

  // --- activité (fusion + tri) ---
  const acts: (ActivityItem & { _d: Date })[] = [
    ...recentPaiements.map((p) => ({
      id: `p${p.id}`, type: "payment" as const,
      name: `${p.credit.client.prenom} ${p.credit.client.nom}`,
      _d: p.datePaiement, date: tempsEcoule(p.datePaiement),
      amount: `+${fmtMRU(p.montant)}`, amountPositive: true,
    })),
    ...recentCredits.map((c) => ({
      id: `c${c.id}`, type: "credit" as const,
      name: `${c.client.prenom} ${c.client.nom}`,
      _d: c.dateCredit, date: tempsEcoule(c.dateCredit),
      amount: `+${fmtMRU(c.montantTotal)}`, amountPositive: true,
    })),
    ...recentClients.map((cl) => ({
      id: `cl${cl.id}`, type: "new_client" as const,
      name: `${cl.prenom} ${cl.nom}`,
      _d: cl.createdAt, date: tempsEcoule(cl.createdAt),
      amount: "", amountPositive: true,
    })),
  ];
  acts.sort((a, b) => b._d.getTime() - a._d.getTime());
  const activities: ActivityItem[] = acts.slice(0, 6).map(({ _d, ...rest }) => rest);

  // --- donut ---
  const totalDistribution = distributionRaw.reduce((s, g) => s + (g._sum.montantTotal ?? 0), 0);
  const segments: DonutSegment[] = distributionRaw.map((g) => {
    const montant = g._sum.montantTotal ?? 0;
    return { statut: g.statutCredit, montant,
      pct: totalDistribution > 0 ? Math.round((montant / totalDistribution) * 100) : 0 };
  });

  // --- top clients (par restant dû) ---
  const topClients: TopClient[] = clientsAvecCredits
    .map((c) => {
      const restant = c.credits
        .filter((cr) => cr.statutCredit !== StatutCredit.PAYE)
        .reduce((s, cr) => s + (cr.montantTotal - cr.montantPaye), 0);
      const statut = restant <= 0 ? StatutCredit.PAYE
        : c.credits.some((cr) => cr.statutCredit === StatutCredit.NON_PAYE) ? StatutCredit.NON_PAYE
        : StatutCredit.EN_COURS;
      return {
        id: c.id, name: `${c.prenom} ${c.nom}`,
        initials: `${c.prenom[0] ?? ""}${c.nom[0] ?? ""}`.toUpperCase(),
        creditTotal: restant, statut,
        lastActivity: fmtDate.format(c.credits[0]?.updatedAt ?? now),
      };
    })
    .filter((c) => c.creditTotal > 0)
    .sort((a, b) => b.creditTotal - a.creditTotal)
    .slice(0, 5);

  // // --- top produits (par quantité vendue) ---
  // const topProduits: TopProduit[] = produitsRaw
  //   .map((p) => ({ id: p.id, nom: p.nom, prixUnitaire: p.prixUnitaire,
  //     vendu: p.credits.reduce((s, cp) => s + cp.quantite, 0) }))
  //   .sort((a, b) => b.vendu - a.vendu)
  //   .slice(0, 5);

  return { stats, activities, distribution: { segments, total: totalDistribution }, topClients, topProduits: [] };
}