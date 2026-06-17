"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { UniteProduit, CategorieProduit } from "@/app/generated/prisma/client";

export type ActionState = { error?: string; success?: boolean };

function readProduitForm(formData: FormData) {
    const nom = (formData.get("nom") as string)?.trim();
    const unite = formData.get("unite") as string;
    const prixUnitaire = Number(formData.get("prixUnitaire"));
    const stock = Number(formData.get("stock"));
    const categorie = formData.get("categorie") as string;

    if (!nom || !unite) return { error: "Le nom et l'unité sont requis." };
    if (Number.isNaN(prixUnitaire) || prixUnitaire < 0) return { error: "Prix unitaire invalide." };
    if (Number.isNaN(stock) || stock < 0) return { error: "Stock invalide." };
    if (!Object.values(UniteProduit).includes(unite as UniteProduit)) return { error: "Unité invalide." };
    if (!Object.values(CategorieProduit).includes(categorie as CategorieProduit)) return { error: "Catégorie invalide." };

    return { data: { nom, categorie: categorie as CategorieProduit, prixUnitaire, stock, unite: unite as UniteProduit } };
}

export async function saveProduit(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const commercantId = await getCommercantId();

    const { data, error } = readProduitForm(formData);
    if (error || !data) return { error };

    const idRaw = formData.get("id");
    const id = idRaw ? Number(idRaw) : null;

    if (id) {
        await prisma.produit.update({ where: { id, commercantId }, data });
    } else {
        await prisma.produit.create({ data: { ...data, commercantId } });
    }

    revalidatePath("/produits");
    return { success: true };
}

export async function deleteProduit(id: number) {
    const commercantId = await getCommercantId();
    await prisma.produit.delete({ where: { id, commercantId } });
    revalidatePath("/produits");
}