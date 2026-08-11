import "server-only";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";

export type CommercantHeader = {
  prenom: string;
  nom: string;
  nomBoutique: string | null;
  aBoutique: boolean;
};

export async function getCommercant(): Promise<CommercantHeader | null> {
  const commercantId = await exigerCommercant();

  const c = await prisma.commercant.findUnique({
    where: { id: commercantId },
    select: {
      utilisateur: { select: { prenom: true, nom: true } },
      boutique: { select: { nom: true } },
    },
  });
  if (!c) return null;

  return {
    prenom: c.utilisateur.prenom,
    nom: c.utilisateur.nom,
    nomBoutique: c.boutique?.nom ?? null,
    aBoutique: !!c.boutique,
  };
}