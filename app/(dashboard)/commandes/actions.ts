"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { StatutCommande, StatutPaiementCommande } from "@/app/generated/prisma/client";

// transitions autorisées (sécurité : on ne saute pas d'étapes)
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

export async function changerStatutCommande(id: number, nouveau: StatutCommande) {
  const commercantId = await getCommercantId();

  const commande = await prisma.commande.findFirst({
    where: { id, commercantId },
    select: { statut: true },
  });
  if (!commande) return;

  // vérifie que la transition est permise
  if (!transitions[commande.statut].includes(nouveau)) return;

  await prisma.commande.update({ where: { id }, data: { statut: nouveau } });
  revalidatePath("/commandes");
}

export async function validerPaiementCommande(id: number) {
  const commercantId = await getCommercantId();
  await prisma.commande.updateMany({
    where: { id, commercantId },
    data: { statutPaiement: StatutPaiementCommande.PAYEE },
  });
  revalidatePath("/commandes");
}