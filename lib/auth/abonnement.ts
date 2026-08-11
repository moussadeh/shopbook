import "server-only";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { StatutPaiementAbonnement } from "@/app/generated/prisma/client";
import type { StatutAcces } from "@/lib/config";

export async function getStatutAcces(): Promise<StatutAcces> {
  const commercantId = await exigerCommercant();

  const c = await prisma.commercant.findUniqueOrThrow({
    where: { id: commercantId },
    select: {
      finEssaiGratuit: true,
      finAbonnement: true,
      paiementsAbonnement: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { statut: true, motifRejet: true },
      },
    },
  });

  const now = new Date();
  const joursRestants = (d: Date) =>
    Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86_400_000));

  if (now <= c.finEssaiGratuit) {
    return {
      acces: true, raison: "essai",
      finLe: c.finEssaiGratuit,
      joursRestants: joursRestants(c.finEssaiGratuit),
    };
  }

  if (c.finAbonnement && now <= c.finAbonnement) {
    return {
      acces: true, raison: "abonne",
      finLe: c.finAbonnement,
      joursRestants: joursRestants(c.finAbonnement),
    };
  }

  const dernier = c.paiementsAbonnement[0];
  if (dernier?.statut === StatutPaiementAbonnement.REJETE) {
    return { acces: false, raison: "paiement_rejete", motif: dernier.motifRejet };
  }
  return { acces: false, raison: "essai_termine" };
}

/** Garde du dashboard : redirige vers /abonnement si l'accès est bloqué */
export async function exigerAcces() {
  const statut = await getStatutAcces();
  if (!statut.acces) redirect("/abonnement");
  return statut;
}