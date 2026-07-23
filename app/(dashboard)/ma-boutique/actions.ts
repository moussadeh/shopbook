"use server";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { genererSlugUnique } from "@/lib/utils/slug";

export type BoutiqueState = { error?: string; success?: boolean };

export async function enregistrerBoutique(_prev: BoutiqueState, formData: FormData): Promise<BoutiqueState> {
  const commercantId = await exigerCommercant();

  const nom         = (formData.get("nom") as string)?.trim();
  const telephone   = (formData.get("telephone") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim() || null;
  const quartier    = ((formData.get("quartier") as string) || "").trim() || null;
  const ville       = ((formData.get("ville") as string) || "").trim() || null;
  const livraisonDisponible = formData.get("livraison") === "on";
  const retraitDisponible   = formData.get("retrait") === "on";

  if (!nom) return { error: "Le nom de la boutique est requis." };
  if (!telephone) return { error: "Le téléphone est requis : vos clients doivent pouvoir vous joindre." };
  if (!livraisonDisponible && !retraitDisponible)
    return { error: "Activez au moins un mode : livraison ou retrait." };

  const existante = await prisma.boutique.findUnique({
    where: { commercantId },
    select: { id: true, nom: true, slug: true },
  });

  // Le slug ne change que si le nom change (pour ne pas casser un lien déjà partagé)
  const slug = existante && existante.nom === nom
    ? existante.slug
    : await genererSlugUnique(nom, existante?.id);

  const data = { nom, slug, description, quartier, ville, telephone, livraisonDisponible, retraitDisponible };

  if (existante) {
    await prisma.boutique.update({ where: { commercantId }, data });
  } else {
    await prisma.boutique.create({ data: { commercantId, ...data } });
  }

  revalidatePath("/ma-boutique");
  revalidatePath("/produits");
  return { success: true };
}

export async function basculerActive(estActive: boolean) {
  const commercantId = await exigerCommercant();
  await prisma.boutique.update({ where: { commercantId }, data: { estActive } });
  revalidatePath("/ma-boutique");
}