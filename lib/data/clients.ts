import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { StatutCredit } from "@/app/generated/prisma/client";

export type ClientRow = {
    id: number;
    prenom: string;
    nom: string;
    name: string;
    initials: string;
    telephone: string;
    email: string;
    creditCount: number;
    creditTotal: string;
    statut: string;
    lastActivity: string;
};

// --- helpers ---
const fmtDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric",
});

function computeStatut(credits: { statutCredit: StatutCredit }[]): string {
  if (credits.length === 0) return "Payé";
  const statuts = credits.map((c) => c.statutCredit);
  if (statuts.every((s) => s === StatutCredit.PAYE))    return "Payé";
  if (statuts.some((s)  => s === StatutCredit.NON_PAYE)) return "Non payé";
  if (statuts.some((s)  => s === StatutCredit.EN_COURS)) return "En cours";
  return "Payé";
}

function computeInitials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

function formatMontant(n: number) {
  return `${n.toLocaleString("fr-FR")} MRU`;
}

export async function getClients(): Promise<ClientRow[]> {
    const commercantId = await getCommercantId();

    const rows = await prisma.client.findMany({
        where: { commercantId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true, prenom: true, nom: true, telephone: true, email: true, createdAt: true,
            credits: {
                select: { montantTotal: true, montantPaye: true, statutCredit: true, updatedAt: true },
                orderBy: { updatedAt: "desc" },
            },
        },
    });

  return rows.map((c) => ({
        id: c.id,
        prenom: c.prenom,
        nom: c.nom,
        name: `${c.prenom} ${c.nom}`,
        initials: computeInitials(c.prenom, c.nom),
        telephone: c.telephone,
        email: c.email ?? "",
        creditCount: c.credits.length,
        creditTotal: formatMontant(
        c.credits
            .filter((cr) => cr.statutCredit !== StatutCredit.PAYE)
            .reduce((sum, cr) => sum + (cr.montantTotal - cr.montantPaye), 0)
        ),
        statut: computeStatut(c.credits),
        lastActivity: fmtDate.format(c.credits[0]?.updatedAt ?? c.createdAt),
  }));
}

// stats
export type ClientsStats = {
  totalClients: number;
  clientsAvecCredits: number;
  nouveauxCeMois: number;
  nouveauxMoisDernier: number;
  totalEncours: number;
};

export async function getClientsStats(): Promise<ClientsStats> {
  const commercantId = await getCommercantId();

  const now = new Date();
  const debutMois        = new Date(now.getFullYear(), now.getMonth(), 1);
  const debutMoisDernier = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Tout en parallèle = une seule attente
  const [totalClients, clientsAvecCredits, nouveauxCeMois, nouveauxMoisDernier, encours] =
    await Promise.all([
      prisma.client.count({ where: { commercantId } }),
      prisma.client.count({ where: { commercantId, credits: { some: {} } } }),
      prisma.client.count({ where: { commercantId, createdAt: { gte: debutMois } } }),
      prisma.client.count({
        where: { commercantId, createdAt: { gte: debutMoisDernier, lt: debutMois } },
      }),
      prisma.credit.aggregate({
        where: { commercantId, statutCredit: { not: StatutCredit.PAYE } },
        _sum: { montantTotal: true, montantPaye: true },
      }),
    ]);

  const totalEncours =
    (encours._sum.montantTotal ?? 0) - (encours._sum.montantPaye ?? 0);

  return { totalClients, clientsAvecCredits, nouveauxCeMois, nouveauxMoisDernier, totalEncours };
}