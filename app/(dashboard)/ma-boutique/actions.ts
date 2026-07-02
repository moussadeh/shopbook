"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { genererSlugUnique } from "@/lib/utils/slug";

export type BoutiqueState = { error?: string; success?: boolean };

export async function enregistrerBoutique(_prev: BoutiqueState, formData: FormData): Promise<BoutiqueState> {
  const commercantId = await getCommercantId();

  const nom         = (formData.get("nom") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim() || null;
  const quartier    = ((formData.get("quartier") as string) || "").trim() || null;
  const telephone   = ((formData.get("telephone") as string) || "").trim() || null;
  const livraison   = formData.get("livraison") === "on";
  const retrait     = formData.get("retrait") === "on";

  if (!nom) return { error: "Le nom de la boutique est requis." };
  if (!livraison && !retrait) return { error: "Activez au moins un mode : livraison ou retrait." };

  const existante = await prisma.boutique.findUnique({
    where: { commercantId },
    select: { id: true, nom: true, slug: true },
  });

  // On régénère le slug seulement si le nom change (pour ne pas casser un lien déjà partagé)
  const slug = existante && existante.nom === nom
    ? existante.slug
    : await genererSlugUnique(nom, existante?.id);

  if (existante) {
    await prisma.boutique.update({
      where: { commercantId },
      data: { nom, slug, description, quartier, telephone, livraison, retrait },
    });
  } else {
    await prisma.boutique.create({
      data: { commercantId, nom, slug, description, quartier, telephone, livraison, retrait },
    });
  }

  revalidatePath("/ma-boutique");
  return { success: true };
}

export async function basculerActive(active: boolean) {
  const commercantId = await getCommercantId();
  await prisma.boutique.update({ where: { commercantId }, data: { active } });
  revalidatePath("/ma-boutique");
}