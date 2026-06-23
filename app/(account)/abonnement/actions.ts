"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { ABONNEMENT_JOURS, PRIX_ABONNEMENT } from "@/lib/data/abonnement-config";
import { MethodePaiement } from "@/app/generated/prisma/client";
import { uploadCapture } from "@/lib/services/storage";
import { notifierAdminNouveauPaiement } from "@/lib/services/email";
import { revalidatePath } from "next/cache";

export type AboState = { error?: string; success?: boolean };

export async function soumettrePaiement(_prev: AboState, formData: FormData): Promise<AboState> {
  const commercantId = await getCommercantId();

  const methode = formData.get("methode") as string;
  const capture = formData.get("capture") as File | null;

  if (!Object.values(MethodePaiement).includes(methode as MethodePaiement))
    return { error: "Méthode de paiement invalide." };
  if (!capture || capture.size === 0)
    return { error: "La capture d'écran est requise." };

  // "Upload" (stub → URL factice + console.log)
  const captureUrl = await uploadCapture(capture, commercantId);

  // Prolonger l'accès immédiatement
  const c = await prisma.commercant.findUniqueOrThrow({
    where: { id: commercantId }, select: { abonneJusquau: true },
  });
  const now = new Date();
  const base = c.abonneJusquau && c.abonneJusquau > now ? c.abonneJusquau : now;
  const abonneJusquau = new Date(base.getTime() + ABONNEMENT_JOURS * 86_400_000);

  await prisma.$transaction([
    prisma.paiementAbonnement.create({
      data: { commercantId, methode: methode as MethodePaiement, montant: PRIX_ABONNEMENT, captureUrl },
    }),
    prisma.commercant.update({ where: { id: commercantId }, data: { abonneJusquau } }),
  ]);

  // Notifier l'admin (stub → console.log)
  await notifierAdminNouveauPaiement({ commercantId, methode, montant: PRIX_ABONNEMENT });

  revalidatePath("/abonnement");
  return { success: true };
}