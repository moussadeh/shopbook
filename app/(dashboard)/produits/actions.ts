// "use server";

// import prisma from "@/prisma/prisma";
// import { getCommercantId } from "@/lib/auth/auth";
// import { revalidatePath } from "next/cache";
// import { CategorieProduit } from "@/app/generated/prisma/client";
// import { uploadImageProduit } from "@/lib/services/storage";

// export type ActionState = { error?: string; success?: boolean };

// function readProduitForm(formData: FormData) {
//     const nom = (formData.get("nom") as string)?.trim();
//     const unite = formData.get("unite") as string;
//     const prixUnitaire = Number(formData.get("prixUnitaire"));
//     const stock = Number(formData.get("stock"));
//     const categorie = formData.get("categorie") as string;

//     if (!nom || !unite) return { error: "Le nom et l'unité sont requis." };
//     if (Number.isNaN(prixUnitaire) || prixUnitaire < 0) return { error: "Prix unitaire invalide." };
//     if (Number.isNaN(stock) || stock < 0) return { error: "Stock invalide." };
//     //if (!Object.values(UniteProduit).includes(unite as UniteProduit)) return { error: "Unité invalide." };
//     if (!Object.values(CategorieProduit).includes(categorie as CategorieProduit)) return { error: "Catégorie invalide." };

//     return { data: { nom, categorie: categorie as CategorieProduit, prixUnitaire, stock } };
// }

// export async function saveProduit(_prev: ActionState, formData: FormData): Promise<ActionState> {
//     const commercantId = await getCommercantId();

//     const { data, error } = readProduitForm(formData);
//     if (error || !data) return { error };

//     const idRaw = formData.get("id");
//     const id = idRaw ? Number(idRaw) : null;

//     if (id) {
//         await prisma.produit.update({ where: { id, commercantId }, data });
//     } else {
//         await prisma.produit.create({ data: { ...data, commercantId } });
//     }

//     revalidatePath("/produits");
//     return { success: true };
// }

// export async function deleteProduit(id: number) {
//     const commercantId = await getCommercantId();
//     await prisma.produit.delete({ where: { id, commercantId } });
//     revalidatePath("/produits");
// }

// const MAX_IMAGES = 3;

// // Bascule la visibilité en boutique
// export async function toggleVisibleBoutique(id: number, visible: boolean) {
//   const commercantId = await getCommercantId();
//   await prisma.produit.updateMany({
//     where: { id, commercantId },
//     data: { visibleBoutique: visible },
//   });
//   revalidatePath("/produits");
// }

// export type ImageState = { error?: string; success?: boolean };

// // Ajoute une image (max 3)
// export async function ajouterImageProduit(_prev: ImageState, formData: FormData): Promise<ImageState> {
//   const commercantId = await getCommercantId();

//   const produitId = Number(formData.get("produitId"));
//   const file = formData.get("image") as File | null;

//   if (!produitId) return { error: "Produit invalide." };
//   if (!file || file.size === 0) return { error: "Aucune image sélectionnée." };
//   if (!file.type.startsWith("image/")) return { error: "Le fichier doit être une image." };
//   if (file.size > 5 * 1024 * 1024) return { error: "Image trop lourde (max 5 Mo)." };

//   // Vérifie l'appartenance + le nombre d'images actuel
//   const produit = await prisma.produit.findFirst({
//     where: { id: produitId, commercantId },
//     select: { id: true, _count: { select: { images: true } } },
//   });
//   if (!produit) return { error: "Produit introuvable." };
//   if (produit._count.images >= MAX_IMAGES) return { error: `Maximum ${MAX_IMAGES} images par produit.` };

//   const url = await uploadImageProduit(file, produitId);

//   await prisma.produitImage.create({
//     data: { produitId, url, ordre: produit._count.images },
//   });

//   revalidatePath("/produits");
//   return { success: true };
// }

// // Supprime une image
// export async function supprimerImageProduit(imageId: number) {
//   const commercantId = await getCommercantId();

//   // sécurité : l'image doit appartenir à un produit du commerçant
//   const image = await prisma.produitImage.findFirst({
//     where: { id: imageId, produit: { commercantId } },
//     select: { id: true },
//   });
//   if (!image) return;

//   await prisma.produitImage.delete({ where: { id: imageId } });
//   revalidatePath("/produits");
// }