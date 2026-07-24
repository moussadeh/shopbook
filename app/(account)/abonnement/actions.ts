"use server";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { ABONNEMENT_JOURS, PRIX_ABONNEMENT } from "@/lib/config";
import { MethodePaiement } from "@/app/generated/prisma/client";
import { uploadCapture } from "@/lib/services/storage";
import { notifierAdminNouveauPaiement } from "@/lib/services/email";
import { revalidatePath } from "next/cache";

export type AboState = { error?: string; success?: boolean };

const NOMBRE_MOIS = 1; // un seul mois pour l'instant

export async function soumettrePaiement(_prev: AboState, formData: FormData): Promise<AboState> {
  const commercantId = await exigerCommercant();

  const methode = formData.get("methode") as string;
  const capture = formData.get("capture") as File | null;

  if (!Object.values(MethodePaiement).includes(methode as MethodePaiement))
    return { error: "Méthode de paiement invalide." };
  if (!capture || capture.size === 0)
    return { error: "La capture d'écran est requise." };
  if (!capture.type.startsWith("image/"))
    return { error: "Le fichier doit être une image." };

  const justificatifUrl = await uploadCapture(capture, commercantId);

  // Prolonge l'accès immédiatement, sans perdre les jours restants
  const c = await prisma.commercant.findUniqueOrThrow({
    where: { id: commercantId },
    select: { finAbonnement: true },
  });

  const now = new Date();
  const base = c.finAbonnement && c.finAbonnement > now ? c.finAbonnement : now;
  const finAbonnement = new Date(base.getTime() + NOMBRE_MOIS * ABONNEMENT_JOURS * 86_400_000);

  await prisma.$transaction([
    prisma.paiementAbonnement.create({
      data: {
        commercantId,
        methodePaiement: methode as MethodePaiement,
        montant: PRIX_ABONNEMENT * NOMBRE_MOIS,
        justificatifUrl,
        nombreMois: NOMBRE_MOIS,
      },
    }),
    prisma.commercant.update({
      where: { id: commercantId },
      data: { finAbonnement },
    }),
  ]);

  await notifierAdminNouveauPaiement({
    commercantId,
    methode,
    montant: PRIX_ABONNEMENT * NOMBRE_MOIS,
  });

  revalidatePath("/abonnement");
  return { success: true };
}