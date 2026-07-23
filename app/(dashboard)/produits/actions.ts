"use server";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { uploadImageProduit } from "@/lib/services/storage";

export type ActionState = { error?: string; success?: boolean };

const MAX_IMAGES = 3;
const MAX_OCTETS = 2 * 1024 * 1024; // 2 Mo

/** Récupère la boutique du commerçant connecté (sécurité : elle lui appartient forcément) */
async function boutiqueDuCommercant(): Promise<number | null> {
  const commercantId = await exigerCommercant();
  const b = await prisma.boutique.findUnique({
    where: { commercantId },
    select: { id: true },
  });
  return b?.id ?? null;
}

function lireForm(formData: FormData) {
  const nom = (formData.get("nom") as string)?.trim();
  const prix = Number(formData.get("prix"));
  const description = ((formData.get("description") as string) || "").trim() || null;
  const disponible = formData.get("disponible") !== "false";

  if (!nom) return { error: "Le nom est requis." };
  if (Number.isNaN(prix) || prix < 0) return { error: "Prix invalide." };

  return { data: { nom, prix, description, disponible } };
}

export async function saveProduit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const boutiqueId = await boutiqueDuCommercant();
  if (!boutiqueId) return { error: "Créez d'abord votre boutique." };

  const { data, error } = lireForm(formData);
  if (error || !data) return { error };

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  let produitId: number;

  if (id) {
    const maj = await prisma.produit.updateMany({ where: { id, boutiqueId }, data });
    if (maj.count === 0) return { error: "Produit introuvable." };
    produitId = id;
  } else {
    const cree = await prisma.produit.create({
      data: { ...data, boutiqueId },
      select: { id: true },
    });
    produitId = cree.id;
  }

  // Images jointes — limite de 3
  const fichiers = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (fichiers.length > 0) {
    const dejaLa = await prisma.imageProduit.count({ where: { produitId } });
    let ordre = dejaLa;

    for (const file of fichiers) {
      if (ordre >= MAX_IMAGES) break;
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_OCTETS) continue;

      const url = await uploadImageProduit(file, produitId);
      await prisma.imageProduit.create({ data: { produitId, url, ordre } });
      ordre++;
    }
  }

  revalidatePath("/produits");
  return { success: true };
}

/**
 * Suppression : possible uniquement si le produit n'a jamais été commandé.
 * Sinon on invite à le rendre indisponible (l'historique des commandes doit rester intact).
 */
export async function deleteProduit(id: number): Promise<{ error?: string }> {
  const boutiqueId = await boutiqueDuCommercant();
  if (!boutiqueId) return { error: "Boutique introuvable." };

  const dejaCommande = await prisma.ligneCommande.count({ where: { produitId: id } });
  if (dejaCommande > 0) {
    return {
      error: "Ce produit apparaît dans des commandes : il ne peut pas être supprimé. Rendez-le indisponible à la place.",
    };
  }

  await prisma.produit.deleteMany({ where: { id, boutiqueId } });
  revalidatePath("/produits");
  return {};
}

export async function toggleDisponible(id: number, disponible: boolean) {
  const boutiqueId = await boutiqueDuCommercant();
  if (!boutiqueId) return;
  await prisma.produit.updateMany({ where: { id, boutiqueId }, data: { disponible } });
  revalidatePath("/produits");
}

export async function supprimerImageProduit(imageId: number) {
  const boutiqueId = await boutiqueDuCommercant();
  if (!boutiqueId) return;

  const image = await prisma.imageProduit.findFirst({
    where: { id: imageId, produit: { boutiqueId } },
    select: { id: true },
  });
  if (!image) return;

  await prisma.imageProduit.delete({ where: { id: imageId } });
  revalidatePath("/produits");
}