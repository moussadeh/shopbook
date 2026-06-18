"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { StatutCredit } from "@/app/generated/prisma/client";

export type ActionState = { error?: string; success?: boolean };

function computeStatut(montantPaye: number, montantTotal: number): StatutCredit {
  if (montantPaye <= 0) return StatutCredit.NON_PAYE;
  if (montantPaye >= montantTotal) return StatutCredit.PAYE;
  return StatutCredit.EN_COURS;
}

export async function saveCredit(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const commercantId = await getCommercantId();

    const clientId     = Number(formData.get("clientId"));
    const montantTotal = Number(formData.get("montantTotal"));
    const description  = ((formData.get("description") as string) || "").trim() || null;

    if (!clientId) return { error: "Le client est requis." };
    if (Number.isNaN(montantTotal) || montantTotal <= 0)
        return { error: "Le montant total doit être supérieur à 0." };

    const idRaw = formData.get("id");
    const id = idRaw ? Number(idRaw) : null;

    if (id) {
        const existing = await prisma.credit.findFirst({
        where: { id, commercantId },
        select: { montantPaye: true },
        });
        if (!existing) return { error: "Crédit introuvable." };
        if (montantTotal < existing.montantPaye)
        return { error: "Le montant total ne peut pas être inférieur au déjà payé." };

        await prisma.credit.update({
        where: { id, commercantId },
        data: {
            clientId,
            montantTotal,
            description,
            statutCredit: computeStatut(existing.montantPaye, montantTotal),
        },
        });
    } else {
        await prisma.credit.create({
        data: {
            commercantId,
            clientId,
            montantTotal,
            description,
            montantPaye: 0,
            statutCredit: StatutCredit.NON_PAYE,
        },
        });
    }

    revalidatePath("/credits");
    return { success: true };
}

export async function addPaiement(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const commercantId = await getCommercantId();

    const creditId = Number(formData.get("creditId"));
    const montant  = Number(formData.get("montant"));

    if (!creditId) return { error: "Crédit invalide." };
    if (Number.isNaN(montant) || montant <= 0)
        return { error: "Le montant doit être supérieur à 0." };

    const credit = await prisma.credit.findFirst({
        where: { id: creditId, commercantId },
        select: { montantTotal: true, montantPaye: true },
    });
    if (!credit) return { error: "Crédit introuvable." };

    const nouveauPaye = credit.montantPaye + montant;
    if (nouveauPaye > credit.montantTotal)
        return { error: "Le paiement dépasse le montant restant." };

    // paiement + mise à jour du crédit, de façon atomique
    await prisma.$transaction([
        prisma.paiement.create({ data: { creditId, montant } }),
        prisma.credit.update({
        where: { id: creditId },
        data: {
            montantPaye: nouveauPaye,
            statutCredit: computeStatut(nouveauPaye, credit.montantTotal),
        },
        }),
    ]);

    revalidatePath("/credits");
    return { success: true };
}

export async function deleteCredit(id: number) {
    const commercantId = await getCommercantId();

    const credit = await prisma.credit.findFirst({ where: { id, commercantId }, select: { id: true } });
    if (!credit) return;

    // on efface les enfants d'abord (pas de cascade dans le schéma)
    await prisma.$transaction([
        prisma.paiement.deleteMany({ where: { creditId: id } }),
        prisma.creditProduit.deleteMany({ where: { creditId: id } }),
        prisma.credit.delete({ where: { id } }),
    ]);

    revalidatePath("/credits");
}