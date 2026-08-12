"use server";

import prisma from "@/prisma/prisma";
import { getUtilisateurActuel } from "@/lib/auth/auth";
import { dateFinEssai } from "@/lib/config";
import { redirect } from "next/navigation";

export async function devenirCommercant() {
  const u = await getUtilisateurActuel();
  if (!u) redirect("/login");

  // déjà commerçant → on l'envoie simplement à son dashboard
  if (u.commercant) redirect("/dashboard");

  // on crée son profil commerçant avec l'essai gratuit qui démarre maintenant
  await prisma.commercant.create({
    data: {
      utilisateurId: u.id,
      finEssaiGratuit: dateFinEssai(),
    },
  });

  redirect("/dashboard");
}