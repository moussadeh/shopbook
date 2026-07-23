"use server";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { StatutCredit } from "@/app/generated/prisma/client";

export type ActionState = { error?: string; success?: boolean };
export type PaiementClientState = { error?: string; success?: boolean };

const num = (d: unknown) => Number(d ?? 0);

function computeStatut(montantPaye: number, montantTotal: number): StatutCredit {
  if (montantPaye <= 0) return StatutCredit.NON_PAYE;
  if (montantPaye >= montantTotal) return StatutCredit.PAYE;
  return StatutCredit.EN_COURS;
}

export async function saveCredit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const commercantId = await exigerCommercant();

  const emprunteurId = Number(formData.get("emprunteurId"));
  const montantTotal = Number(formData.get("montantTotal"));
  const description  = ((formData.get("description") as string) || "").trim() || null;

  if (!emprunteurId) return { error: "Le client est requis." };
  if (Number.isNaN(montantTotal) || montantTotal <= 0)
    return { error: "Le montant total doit être supérieur à 0." };

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  if (id) {
    const existant = await prisma.credit.findFirst({
      where: { id, commercantId },
      select: { montantPaye: true },
    });
    if (!existant) return { error: "Crédit introuvable." };

    const dejaPaye = num(existant.montantPaye);
    if (montantTotal < dejaPaye)
      return { error: "Le montant total ne peut pas être inférieur au déjà payé." };

    await prisma.credit.updateMany({
      where: { id, commercantId },
      data: {
        emprunteurId,
        montantTotal,
        description,
        statutCredit: computeStatut(dejaPaye, montantTotal),
      },
    });
  } else {
    await prisma.credit.create({
      data: {
        commercantId,
        emprunteurId,
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

export async function deleteCredit(id: number) {
  const commercantId = await exigerCommercant();
  // les paiements partent en cascade (onDelete: Cascade dans le schéma)
  await prisma.credit.deleteMany({ where: { id, commercantId } });
  revalidatePath("/credits");
}

/** Paiement au niveau du client : imputation en cascade, du plus ancien au plus récent */
export async function payerClient(_prev: PaiementClientState, formData: FormData): Promise<PaiementClientState> {
  const commercantId = await exigerCommercant();

  const emprunteurId = Number(formData.get("emprunteurId"));
  const observation  = ((formData.get("observation") as string) || "").trim() || null;
  let restant = Number(formData.get("montant"));

  if (!emprunteurId) return { error: "Client invalide." };
  if (Number.isNaN(restant) || restant <= 0) return { error: "Le montant doit être supérieur à 0." };

  const credits = await prisma.credit.findMany({
    where: { commercantId, emprunteurId, statutCredit: { not: StatutCredit.PAYE } },
    orderBy: { dateCredit: "asc" },
    select: { id: true, montantTotal: true, montantPaye: true },
  });

  const resteTotal = credits.reduce((s, c) => s + (num(c.montantTotal) - num(c.montantPaye)), 0);
  if (restant > resteTotal) return { error: "Le paiement dépasse le total dû par ce client." };

  const ops = [];
  for (const credit of credits) {
    if (restant <= 0) break;

    const total = num(credit.montantTotal);
    const paye  = num(credit.montantPaye);
    const aImputer = Math.min(restant, total - paye);
    const nouveauPaye = paye + aImputer;

    ops.push(prisma.paiement.create({
      data: { creditId: credit.id, montant: aImputer, observation },
    }));
    ops.push(prisma.credit.update({
      where: { id: credit.id },
      data: {
        montantPaye: nouveauPaye,
        statutCredit: computeStatut(nouveauPaye, total),
      },
    }));

    restant -= aImputer;
  }

  await prisma.$transaction(ops);
  revalidatePath("/credits");
  return { success: true };
}

/** Corrige une erreur de saisie : retire le dernier paiement enregistré */
export async function annulerDernierPaiement(emprunteurId: number) {
  const commercantId = await exigerCommercant();

  const dernier = await prisma.paiement.findFirst({
    where: { credit: { commercantId, emprunteurId } },
    orderBy: { datePaiement: "desc" },
    select: {
      id: true, montant: true, creditId: true,
      credit: { select: { montantTotal: true, montantPaye: true } },
    },
  });
  if (!dernier) return;

  const total = num(dernier.credit.montantTotal);
  const nouveauPaye = num(dernier.credit.montantPaye) - num(dernier.montant);

  await prisma.$transaction([
    prisma.paiement.delete({ where: { id: dernier.id } }),
    prisma.credit.update({
      where: { id: dernier.creditId },
      data: { montantPaye: nouveauPaye, statutCredit: computeStatut(nouveauPaye, total) },
    }),
  ]);

  revalidatePath("/credits");
}