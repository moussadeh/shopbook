"use server";

import prisma from "@/prisma/prisma";
import { registerAcheteurSchema, loginAcheteurSchema } from "@/lib/validations/acheteur";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createAcheteurSession, destroyAcheteurSession } from "@/lib/auth/acheteur-session";

export type AcheteurAuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  success?: boolean;
};

function toFieldErrors(flatten: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const k in flatten) if (flatten[k]?.[0]) out[k] = flatten[k]![0];
  return out;
}

export async function registerAcheteur(_prev: AcheteurAuthState, formData: FormData): Promise<AcheteurAuthState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { nom: raw.nom ?? "", telephone: raw.telephone ?? "" }; // jamais le mot de passe

  const parsed = registerAcheteurSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
  }
  const { nom, telephone, motDePasse } = parsed.data;

  const existe = await prisma.acheteur.findUnique({ where: { telephone }, select: { id: true } });
  if (existe) {
    return { fieldErrors: { telephone: "Ce numéro a déjà un compte. Connectez-vous." }, values };
  }

  const acheteur = await prisma.acheteur.create({
    data: { nom, telephone, motDePasse: await hashPassword(motDePasse) },
    select: { id: true },
  });

  await createAcheteurSession(acheteur.id);
  return { success: true };
}

export async function loginAcheteur(_prev: AcheteurAuthState, formData: FormData): Promise<AcheteurAuthState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { telephone: raw.telephone ?? "" };

  const parsed = loginAcheteurSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
  }
  const { telephone, motDePasse } = parsed.data;

  const acheteur = await prisma.acheteur.findUnique({
    where: { telephone },
    select: { id: true, motDePasse: true },
  });

  if (!acheteur || !(await verifyPassword(motDePasse, acheteur.motDePasse))) {
    return { error: "Numéro ou mot de passe incorrect", values };
  }

  await createAcheteurSession(acheteur.id);
  return { success: true };
}

export async function logoutAcheteur() {
  await destroyAcheteurSession();
}