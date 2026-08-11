"use server";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { StatutCommande, StatutPaiementCommande } from "@/app/generated/prisma/client";

const transitions: Record<StatutCommande, StatutCommande[]> = {
  NOUVELLE:       [StatutCommande.EN_PREPARATION, StatutCommande.REFUSEE],
  EN_PREPARATION: [StatutCommande.PRETE, StatutCommande.EN_LIVRAISON, StatutCommande.ANNULEE],
  PRETE:          [StatutCommande.RECUPEREE, StatutCommande.ANNULEE],
  EN_LIVRAISON:   [StatutCommande.LIVREE, StatutCommande.ANNULEE],
  RECUPEREE:      [],
  LIVREE:         [],
  REFUSEE:        [],
  ANNULEE:        [],
};

/** boutique du commerçant connecté (garantit qu'il agit sur SES commandes) */
async function boutiqueDuCommercant(): Promise<number | null> {
  const commercantId = await exigerCommercant();
  const b = await prisma.boutique.findUnique({
    where: { commercantId },
    select: { id: true },
  });
  return b?.id ?? null;
}

export async function changerStatutCommande(id: number, nouveau: StatutCommande) {
  const boutiqueId = await boutiqueDuCommercant();
  if (!boutiqueId) return;

  const commande = await prisma.commande.findFirst({
    where: { id, boutiqueId },
    select: { statutCommande: true },
  });
  if (!commande) return;

  if (!transitions[commande.statutCommande].includes(nouveau)) return;

  await prisma.commande.update({ where: { id }, data: { statutCommande: nouveau } });
  revalidatePath("/commandes");
}

export async function validerPaiementCommande(id: number) {
  const boutiqueId = await boutiqueDuCommercant();
  if (!boutiqueId) return;

  await prisma.commande.updateMany({
    where: { id, boutiqueId },
    data: { statutPaiement: StatutPaiementCommande.PAYEE },
  });
  revalidatePath("/commandes");
}