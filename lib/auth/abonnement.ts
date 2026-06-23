import "server-only";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { StatutPaiementAbo } from "@/app/generated/prisma/client";
import { type StatutAcces } from "@/lib/data/abonnement-config";

export async function getStatutAcces(): Promise<StatutAcces> {
  const commercantId = await getCommercantId();

  const c = await prisma.commercant.findUniqueOrThrow({
    where: { id: commercantId },
    select: {
      essaiFinLe: true,
      abonneJusquau: true,
      paiementsAbo: {
        orderBy: { createdAt: "desc" }, take: 1,
        select: { statut: true, motifRejet: true },
      },
    },
  });

  const now = new Date();
  const joursRestants = (d: Date) =>
    Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86_400_000));

  // Essai gratuit encore valide
  if (now <= c.essaiFinLe) {
    return { acces: true, raison: "essai", finLe: c.essaiFinLe, joursRestants: joursRestants(c.essaiFinLe) };
  }

  // Abonnement payant encore valide
  if (c.abonneJusquau && now <= c.abonneJusquau) {
    return { acces: true, raison: "abonne", finLe: c.abonneJusquau, joursRestants: joursRestants(c.abonneJusquau) };
  }

  // Bloqué — on regarde le dernier paiement pour le bon message
  const dernier = c.paiementsAbo[0];
  if (dernier?.statut === StatutPaiementAbo.REJETE) {
    return { acces: false, raison: "paiement_rejete", motif: dernier.motifRejet };
  }
  return { acces: false, raison: "essai_termine" };
}

// Garde pour le dashboard : redirige vers /abonnement si bloqué
export async function exigerAcces() {
  const statut = await getStatutAcces();
  if (!statut.acces) redirect("/abonnement");
  return statut;
}

export async function exigerAdmin() {
  const id = await getCommercantId();
  const c = await prisma.commercant.findUnique({ where: { id }, select: { role: true } });
  if (c?.role !== "ADMIN") redirect("/");
}