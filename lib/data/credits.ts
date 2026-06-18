import "server-only";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { StatutCredit } from "@/app/generated/prisma/client";

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

export type ClientOption = { id: number; name: string };

const fmtDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export async function getCredits(): Promise<CreditRow[]> {
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
        _count: { select: { produits: true } }, // CreditProduit
        },
    });

    return rows.map((c) => ({
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
    }));
}

// Liste légère pour le Select du formulaire
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