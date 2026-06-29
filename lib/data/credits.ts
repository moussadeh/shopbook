import "server-only";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { StatutCredit } from "@/app/generated/prisma/client";

// Un crédit individuel (utilisé dans le détail, le formulaire, le paiement)
export type CreditRow = {
  id: number;
  clientId: number;
  clientName: string;
  clientInitials: string;
  description: string;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  statut: StatutCredit;
  date: string;
  produits: number;
};

// Une ligne du tableau = un client avec tous ses crédits regroupés
export type ClientCreditRow = {
  clientId: number;
  clientName: string;
  clientInitials: string;
  nbCredits: number;
  montantTotal: number;     // somme des montants
  montantPaye: number;      // somme des paiements
  montantRestant: number;   // somme des restants
  statutGlobal: StatutCredit;
  derniereActivite: string; // date du crédit le plus récent
  credits: CreditRow[];     // le détail
};

export type ClientOption = { id: number; name: string };

const fmtDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// Statut global d'un client à partir de ses crédits
function statutGlobal(credits: { montantTotal: number; montantPaye: number }[]): StatutCredit {
  const total = credits.reduce((s, c) => s + c.montantTotal, 0);
  const paye = credits.reduce((s, c) => s + c.montantPaye, 0);

  if (paye >= total) return StatutCredit.PAYE;   // tout est réglé
  if (paye <= 0)     return StatutCredit.NON_PAYE; // rien n'a été payé
  return StatutCredit.EN_COURS;                   // paiement partiel
}

export async function getCredits(): Promise<ClientCreditRow[]> {
  const commercantId = await getCommercantId();

  const rows = await prisma.credit.findMany({
    where: { commercantId },
    orderBy: { dateCredit: "desc" },
    select: {
      id: true,
      clientId: true,
      description: true,
      montantTotal: true,
      montantPaye: true,
      statutCredit: true,
      dateCredit: true,
      client: { select: { prenom: true, nom: true } },
      _count: { select: { produits: true } },
    },
  });

  // Transforme chaque crédit en CreditRow
  const creditsDetailles: (CreditRow & { _date: Date })[] = rows.map((c) => ({
    id: c.id,
    clientId: c.clientId,
    clientName: `${c.client.prenom} ${c.client.nom}`,
    clientInitials: `${c.client.prenom[0] ?? ""}${c.client.nom[0] ?? ""}`.toUpperCase(),
    description: c.description ?? "",
    montantTotal: c.montantTotal,
    montantPaye: c.montantPaye,
    montantRestant: c.montantTotal - c.montantPaye,
    statut: c.statutCredit,
    date: fmtDate.format(c.dateCredit),
    produits: c._count.produits,
    _date: c.dateCredit,
  }));

  // Regroupe par client
  const parClient = new Map<number, (CreditRow & { _date: Date })[]>();
  for (const credit of creditsDetailles) {
    const liste = parClient.get(credit.clientId) ?? [];
    liste.push(credit);
    parClient.set(credit.clientId, liste);
  }

  // Construit une ligne par client
  const lignes: ClientCreditRow[] = [];
  for (const [clientId, credits] of parClient) {
    const premier = credits[0]; // déjà trié par date desc
    const montantTotal = credits.reduce((s, c) => s + c.montantTotal, 0);
    const montantPaye = credits.reduce((s, c) => s + c.montantPaye, 0);

    lignes.push({
      clientId,
      clientName: premier.clientName,
      clientInitials: premier.clientInitials,
      nbCredits: credits.length,
      montantTotal,
      montantPaye,
      montantRestant: montantTotal - montantPaye,
      statutGlobal: statutGlobal(credits),
      derniereActivite: premier.date,
      // on retire le champ technique _date avant d'exposer les crédits
      credits: credits.map(({ _date, ...rest }) => rest),
    });
  }

  // Trie les clients par dernière activité (le plus récent d'abord)
  // (parClient préserve l'ordre d'insertion = ordre des crédits triés desc,
  //  donc les clients sont déjà à peu près dans le bon ordre ; on s'assure)
  return lignes;
}

// --- inchangé en dessous ---

export async function getClientsOptions(): Promise<ClientOption[]> {
  const commercantId = await getCommercantId();
  const clients = await prisma.client.findMany({
    where: { commercantId },
    orderBy: [{ prenom: "asc" }, { nom: "asc" }],
    select: { id: true, prenom: true, nom: true },
  });
  return clients.map((c) => ({ id: c.id, name: `${c.prenom} ${c.nom}` }));
}

export type CreditsStats = {
  creditsActifs: number;
  encoursTotal: number;
  encaisseCeMois: number;
  creditsSoldes: number;
};

export async function getCreditsStats(): Promise<CreditsStats> {
  const commercantId = await getCommercantId();
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
    encoursTotal: (encours._sum.montantTotal ?? 0) - (encours._sum.montantPaye ?? 0),
    encaisseCeMois: paiementsMois._sum.montant ?? 0,
    creditsSoldes,
  };
}


// import "server-only";

// import prisma from "@/prisma/prisma";
// import { getCommercantId } from "@/lib/auth/auth";
// import { StatutCredit } from "@/app/generated/prisma/client";

// export type CreditRow = {
//     id: number;
//     clientId: number;
//     clientName: string;
//     clientInitials: string;
//     description: string;
//     montantTotal: number;
//     montantPaye: number;
//     montantRestant: number;
//     statut: StatutCredit;
//     date: string;
//     produits: number;
// };

// export type ClientOption = { id: number; name: string };

// const fmtDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// export async function getCredits(): Promise<CreditRow[]> {
//     const commercantId = await getCommercantId();

//     const rows = await prisma.credit.findMany({
//         where: { commercantId },
//         orderBy: { dateCredit: "desc" },
//         select: {
//         id: true,
//         clientId: true,
//         description: true,
//         montantTotal: true,
//         montantPaye: true,
//         statutCredit: true,
//         dateCredit: true,
//         client: { select: { prenom: true, nom: true } },
//         _count: { select: { produits: true } }, // CreditProduit
//         },
//     });

//     return rows.map((c) => ({
//         id: c.id,
//         clientId: c.clientId,
//         clientName: `${c.client.prenom} ${c.client.nom}`,
//         clientInitials: `${c.client.prenom[0] ?? ""}${c.client.nom[0] ?? ""}`.toUpperCase(),
//         description: c.description ?? "",
//         montantTotal: c.montantTotal,
//         montantPaye: c.montantPaye,
//         montantRestant: c.montantTotal - c.montantPaye,
//         statut: c.statutCredit,
//         date: fmtDate.format(c.dateCredit),
//         produits: c._count.produits,
//     }));
// }

// // Liste légère pour le Select du formulaire
// export async function getClientsOptions(): Promise<ClientOption[]> {
//     const commercantId = await getCommercantId();
//     const clients = await prisma.client.findMany({
//         where: { commercantId },
//         orderBy: [{ prenom: "asc" }, { nom: "asc" }],
//         select: { id: true, prenom: true, nom: true },
//     });
//     return clients.map((c) => ({ id: c.id, name: `${c.prenom} ${c.nom}` }));
// }

// export type CreditsStats = {
//     creditsActifs: number;
//     encoursTotal: number;
//     encaisseCeMois: number;
//     creditsSoldes: number;
// };

// export async function getCreditsStats(): Promise<CreditsStats> {
//     const commercantId = await getCommercantId();
//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

//     const [creditsActifs, creditsSoldes, encours, paiementsMois] = await Promise.all([
//         prisma.credit.count({ where: { commercantId, statutCredit: { not: StatutCredit.PAYE } } }),
//         prisma.credit.count({ where: { commercantId, statutCredit: StatutCredit.PAYE } }),
//         prisma.credit.aggregate({
//         where: { commercantId, statutCredit: { not: StatutCredit.PAYE } },
//         _sum: { montantTotal: true, montantPaye: true },
//         }),
//         prisma.paiement.aggregate({
//         where: { credit: { commercantId }, datePaiement: { gte: debutMois } },
//         _sum: { montant: true },
//         }),
//     ]);

//     return {
//         creditsActifs,
//         encoursTotal: (encours._sum.montantTotal ?? 0) - (encours._sum.montantPaye ?? 0),
//         encaisseCeMois: paiementsMois._sum.montant ?? 0,
//         creditsSoldes,
//     };
// }