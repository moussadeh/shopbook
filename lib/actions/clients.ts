"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { StatutCredit } from "@/app/generated/prisma/client";

// helpers

function computeStatut(credits: { statutCredit: StatutCredit }[]): string {
  if (credits.length === 0) return "Payé";

  const statuts = credits.map((c) => c.statutCredit);

  if (statuts.every((s) => s === StatutCredit.PAYE))     return "Payé";
  if (statuts.some((s)  => s === StatutCredit.NON_PAYE)) return "Non payé";
  if (statuts.some((s)  => s === StatutCredit.EN_COURS)) return "En cours";
  return "Payé";
}

function computeInitials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

function formatMontant(n: number) {
  return `${n.toLocaleString("fr-FR")} MRU`;
}

// get clients
export async function getClients() {
  const commercantId = await getCommercantId();

  const rows = await prisma.client.findMany({
    where: { commercantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      prenom: true,
      nom: true,
      telephone: true,
      email: true,
      createdAt: true,
      credits: {
        select: {
          id: true,
          montantTotal: true,
          montantPaye: true,
          statutCredit: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return rows.map((c) => ({
    id: c.id,
    prenom: c.prenom,
    nom: c.nom,
    name: `${c.prenom} ${c.nom}`,
    initials: computeInitials(c.prenom, c.nom),
    telephone: c.telephone,
    email: c.email ?? "",
    creditCount: c.credits.length,
    creditTotal: formatMontant(
      c.credits
        .filter((cr) => cr.statutCredit !== StatutCredit.PAYE)
        .reduce((sum, cr) => sum + (cr.montantTotal - cr.montantPaye), 0)
    ),
    statut: computeStatut(c.credits),
    lastActivity: c.credits[0]?.updatedAt ?? c.createdAt,
  }));
}

// create client
export async function createClient(_prevState: { error?: string; success?: boolean }, formData: FormData) {
  const commercantId = await getCommercantId();

  const prenom    = formData.get("prenom") as string;
  const nom       = formData.get("nom") as string;
  const telephone = formData.get("telephone") as string;
  const email     = (formData.get("email") as string) || null;

  if (!prenom || !nom || !telephone) {
    return { error: "Prénom, nom et téléphone sont requis." };
  }

  await prisma.client.create({
    data: { prenom, nom, telephone, email, commercantId },
  });

  revalidatePath("/clients");
  return { success: true };
}

// update client
export async function updateClient(_prevState: { error?: string; success?: boolean }, formData: FormData) {
  const commercantId = await getCommercantId();

  const id        = Number(formData.get("id"));
  const prenom    = formData.get("prenom") as string;
  const nom       = formData.get("nom") as string;
  const telephone = formData.get("telephone") as string;
  const email     = (formData.get("email") as string) || null;

  if (!id || !prenom || !nom || !telephone) {
    return { error: "Données invalides." };
  }

  await prisma.client.update({
    where:  { id, commercantId }, // sécurité multi-tenant : un commercant ne peut pas modifier le client d'un autre
    data:   { prenom, nom, telephone, email },
  });

  revalidatePath("/clients");
  return { success: true };
}

// delete client
export async function deleteClient(id: number) {
  const commercantId = await getCommercantId();

  await prisma.client.delete({
    where: { id, commercantId },
  });

  revalidatePath("/clients");
}