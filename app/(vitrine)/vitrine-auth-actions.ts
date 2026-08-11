"use server";

import prisma from "@/prisma/prisma";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  success?: boolean;
};

function toFieldErrors(flatten: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const key in flatten) {
    const msg = flatten[key]?.[0];
    if (msg) out[key] = msg;
  }
  return out;
}

/** Inscription depuis la vitrine : crée un compte CLIENT, sans redirection */
export async function registerDepuisVitrine(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values: Record<string, string> = { ...raw };
  delete values.motDePasse;

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
  }
  const d = parsed.data;

  const existe = await prisma.utilisateur.findUnique({
    where: { telephone: d.telephone },
    select: { id: true },
  });
  if (existe) {
    return { fieldErrors: { telephone: "Ce numéro a déjà un compte. Connectez-vous." }, values };
  }

  const utilisateur = await prisma.utilisateur.create({
    data: {
      prenom: d.prenom,
      nom: d.nom,
      telephone: d.telephone,
      motDePasse: await hashPassword(d.motDePasse),
      client: { create: {} }, // profil client, toujours, depuis la vitrine
    },
    select: { id: true },
  });

  await createSession(utilisateur.id);
  return { success: true };
}

/** Connexion depuis la vitrine : ouvre la session, sans redirection */
export async function loginDepuisVitrine(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { telephone: raw.telephone ?? "" };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
  }
  const { telephone, motDePasse } = parsed.data;

  const u = await prisma.utilisateur.findUnique({
    where: { telephone },
    select: { id: true, motDePasse: true, actif: true },
  });

  if (!u || !(await verifyPassword(motDePasse, u.motDePasse))) {
    return { error: "Téléphone ou mot de passe incorrect", values };
  }
  if (!u.actif) {
    return { error: "Ce compte a été désactivé", values };
  }

  await createSession(u.id);
  return { success: true };
}