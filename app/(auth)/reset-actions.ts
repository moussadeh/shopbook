"use server";

import prisma from "@/prisma/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { envoyerSMS } from "@/lib/services/sms";
import { z } from "zod";

const CODE_VALIDITE_MIN = 15;

const telSchema = z.string().regex(/^\+222\d{8}$/, "Numéro invalide");

export type ResetState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
  telephone?: string; // repassé d'une étape à l'autre
};

/* ---- Étape 1 : demander un code ---- */
export async function demanderCode(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const telephone = (formData.get("telephone") as string) ?? "";

  const parsed = telSchema.safeParse(telephone);
  if (!parsed.success) {
    return { fieldErrors: { telephone: "Numéro invalide" }, telephone };
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { telephone },
    select: { id: true },
  });

  // Sécurité : on répond pareil que le compte existe ou non
  // (sinon on révèlerait quels numéros ont un compte).
  if (utilisateur) {
    // code à 6 chiffres aléatoire
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHache = await hashPassword(code);
    const expireLe = new Date(Date.now() + CODE_VALIDITE_MIN * 60 * 1000);

    // on invalide les anciens codes de ce numéro, puis on crée le nouveau
    await prisma.codeReinitialisation.updateMany({
      where: { telephone, utilise: false },
      data: { utilise: true },
    });
    await prisma.codeReinitialisation.create({
      data: { telephone, codeHache, expireLe },
    });

    await envoyerSMS(telephone, `ShopBook : votre code de réinitialisation est ${code}. Valable ${CODE_VALIDITE_MIN} minutes.`);
  }

  // toujours "succès" → on passe à l'étape code
  return { success: true, telephone };
}

/* ---- Étape 2 : vérifier le code ---- */
export async function verifierCode(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const telephone = (formData.get("telephone") as string) ?? "";
  const code = ((formData.get("code") as string) ?? "").trim();

  if (!/^\d{6}$/.test(code)) {
    return { fieldErrors: { code: "Code à 6 chiffres" }, telephone };
  }

  const enregistrement = await prisma.codeReinitialisation.findFirst({
    where: { telephone, utilise: false },
    orderBy: { createdAt: "desc" },
  });

  if (!enregistrement || enregistrement.expireLe < new Date()) {
    return { error: "Code expiré ou invalide. Recommencez.", telephone };
  }

  const ok = await verifyPassword(code, enregistrement.codeHache);
  if (!ok) {
    return { fieldErrors: { code: "Code incorrect" }, telephone };
  }

  // code bon → on passe à l'étape mot de passe (on ne le consomme pas encore)
  return { success: true, telephone };
}

/* ---- Étape 3 : définir le nouveau mot de passe ---- */
export async function definirNouveauMotDePasse(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const telephone = (formData.get("telephone") as string) ?? "";
  const code = ((formData.get("code") as string) ?? "").trim();
  const motDePasse = (formData.get("motDePasse") as string) ?? "";
  const confirmation = (formData.get("confirmation") as string) ?? "";

  if (motDePasse.length < 6) {
    return { fieldErrors: { motDePasse: "Au moins 6 caractères" }, telephone };
  }
  if (motDePasse !== confirmation) {
    return { fieldErrors: { confirmation: "Les mots de passe ne correspondent pas" }, telephone };
  }

  // on re-vérifie le code (l'utilisateur pourrait forger la requête)
  const enregistrement = await prisma.codeReinitialisation.findFirst({
    where: { telephone, utilise: false },
    orderBy: { createdAt: "desc" },
  });
  if (!enregistrement || enregistrement.expireLe < new Date() || !(await verifyPassword(code, enregistrement.codeHache))) {
    return { error: "Session expirée. Recommencez la procédure.", telephone };
  }

  // on change le mot de passe ET on consomme le code, dans une transaction
  await prisma.$transaction([
    prisma.utilisateur.update({
      where: { telephone },
      data: { motDePasse: await hashPassword(motDePasse) },
    }),
    prisma.codeReinitialisation.update({
      where: { id: enregistrement.id },
      data: { utilise: true },
    }),
  ]);

  // pas de connexion auto : l'utilisateur ira se connecter
  return { success: true };
}