"use server";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

function readClientForm(formData: FormData) {
    const prenom    = (formData.get("prenom") as string)?.trim();
    const nom       = (formData.get("nom") as string)?.trim();
    const telephone = (formData.get("telephone") as string)?.trim();
    const email     = ((formData.get("email") as string) || "").trim() || null;

    if (!prenom || !nom || !telephone) {
        return { error: "Prénom, nom et téléphone sont requis." as string };
    }
    return { data: { prenom, nom, telephone, email } };
}

export async function saveClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const commercantId = await getCommercantId();

    const { data, error } = readClientForm(formData);
    if (error || !data) return { error };

    const idRaw = formData.get("id");
    const id = idRaw ? Number(idRaw) : null;

    if (id) {
        await prisma.client.update({
            where: { id, commercantId },
            data,
        });
    } else {
        await prisma.client.create({
            data: { ...data, commercantId },
        });
    }

    revalidatePath("/clients");
    return { success: true };
}

export async function deleteClient(id: number) {
    const commercantId = await getCommercantId();
    await prisma.client.delete({
        where: { id, commercantId },
    });
    revalidatePath("/clients");
}