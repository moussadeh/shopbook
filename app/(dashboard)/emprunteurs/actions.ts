"use server";

import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean };

function readForm(formData: FormData) {
  const prenom    = (formData.get("prenom") as string)?.trim();
  const nom       = (formData.get("nom") as string)?.trim();
  const telephone = ((formData.get("telephone") as string) || "").trim() || null;

  if (!prenom || !nom) return { error: "Le prénom et le nom sont requis." as string };
  return { data: { prenom, nom, telephone } };
}

export async function saveEmprunteur(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const commercantId = await exigerCommercant();

  const { data, error } = readForm(formData);
  if (error || !data) return { error };

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  if (id) {
    await prisma.emprunteur.updateMany({ where: { id, commercantId }, data });
  } else {
    await prisma.emprunteur.create({ data: { ...data, commercantId } });
  }

  revalidatePath("/emprunteurs");
  return { success: true };
}

export async function deleteEmprunteur(id: number) {
  const commercantId = await exigerCommercant();
  await prisma.emprunteur.deleteMany({ where: { id, commercantId } });
  revalidatePath("/emprunteurs");
}