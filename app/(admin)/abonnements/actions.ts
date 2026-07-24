"use server";

import prisma from "@/prisma/prisma";
import { exigerAdmin } from "@/lib/auth/auth";
import { StatutPaiementAbonnement } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

export type AdminAboState = { error?: string; success?: boolean };

export async function approuverPaiement(id: number) {
  await exigerAdmin();
  await prisma.paiementAbonnement.update({
    where: { id },
    data: { statut: StatutPaiementAbonnement.APPROUVE, dateVerification: new Date() },
  });
  revalidatePath("/abonnements");
}

export async function rejeterPaiement(_prev: AdminAboState, formData: FormData): Promise<AdminAboState> {
  await exigerAdmin();

  const id = Number(formData.get("id"));
  const motif = ((formData.get("motif") as string) || "").trim();
  if (!id) return { error: "Paiement invalide." };
  if (!motif) return { error: "Indiquez un motif de rejet." };

  const paiement = await prisma.paiementAbonnement.update({
    where: { id },
    data: {
      statut: StatutPaiementAbonnement.REJETE,
      motifRejet: motif,
      dateVerification: new Date(),
    },
    select: { commercantId: true },
  });

  // coupe l'accès immédiatement
  await prisma.commercant.update({
    where: { id: paiement.commercantId },
    data: { finAbonnement: new Date() },
  });

  revalidatePath("/abonnements");
  return { success: true };
}