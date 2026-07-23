"use server";

import { redirect } from "next/navigation";
import prisma from "@/prisma/prisma";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { dateFinEssai } from "@/lib/config";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

function toFieldErrors(flatten: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const key in flatten) {
    const msg = flatten[key]?.[0];
    if (msg) out[key] = msg;
  }
  return out;
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values: Record<string, string> = { ...raw };
  delete values.motDePasse;

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
  }
  const d = parsed.data;

  // le téléphone est l'identifiant unique de connexion
  const existe = await prisma.utilisateur.findUnique({
    where: { telephone: d.telephone },
    select: { id: true },
  });
  if (existe) {
    return { fieldErrors: { telephone: "Ce numéro a déjà été utilisé" }, values };
  }

  const utilisateur = await prisma.utilisateur.create({
    data: {
      prenom: d.prenom,
      nom: d.nom,
      telephone: d.telephone,
      motDePasse: await hashPassword(d.motDePasse),
      // le profil choisi naît en même temps que le compte
      ...(d.profil === "COMMERCANT"
        ? {
            commercant: {
              create: {
                ville: d.ville || null,
                quartier: d.quartier || null,
                finEssaiGratuit: dateFinEssai(),
              },
            },
          }
        : {
            client: {
              create: {
                ville: d.ville || null,
                quartier: d.quartier || null,
              },
            },
          }),
    },
    select: { id: true },
  });

  await createSession(utilisateur.id);
  redirect(d.profil === "COMMERCANT" ? "/dashboard" : "/mes-commandes");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { telephone: raw.telephone ?? "" };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
  }
  const { telephone, motDePasse } = parsed.data;

  const u = await prisma.utilisateur.findUnique({
    where: { telephone },
    select: {
      id: true, motDePasse: true, actif: true, estAdmin: true,
      commercant: { select: { id: true } },
      client: { select: { id: true } },
    },
  });

  // message générique : on ne révèle pas si le numéro existe
  if (!u || !(await verifyPassword(motDePasse, u.motDePasse))) {
    return { error: "Téléphone ou mot de passe incorrect", values };
  }
  if (!u.actif) {
    return { error: "Ce compte a été désactivé", values };
  }

  await createSession(u.id);

  if (u.estAdmin) redirect("/messages");
  if (u.commercant) redirect("/dashboard");
  if (u.client) redirect("/mes-commandes");
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

// "use server";

// import { redirect } from "next/navigation";
// import prisma from "@/prisma/prisma";
// import { registerSchema, loginSchema } from "@/lib/validations/auth";
// import { hashPassword, verifyPassword } from "@/lib/auth/password";
// import { createSession, destroySession } from "@/lib/auth/session";

// export type AuthState = {
//     error?: string;                        // erreur globale → Alert
//     fieldErrors?: Record<string, string>;  // erreurs par champ
//     values?: Record<string, string>;
// };

// // transforme les erreurs Zod en { champ: "message" }
// function toFieldErrors(flatten: Record<string, string[] | undefined>) {
//     const out: Record<string, string> = {};
//     for (const key in flatten) {
//         const msg = flatten[key]?.[0];
//         if (msg) out[key] = msg;
//     }
//     return out;
// }

// export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
//     const raw = Object.fromEntries(formData) as Record<string, string>;
//     const values: Record<string, string> = { ...raw };
//     delete values.motDePasse;

//     const parsed = registerSchema.safeParse(raw);
//     if (!parsed.success) {
//         return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values };
//     }
//     const d = parsed.data;

//     // unicité email / téléphone
//     const existing = await prisma.commercant.findFirst({
//         where: { OR: [{ email: d.email }, { telephone: d.telephone }] },
//         select: { email: true },
//     });
//     if (existing) {
//         return existing.email === d.email
//         ? { fieldErrors: { email: "Cet email est déjà utilisé" } }
//         : { fieldErrors: { telephone: "Ce numéro est déjà utilisé" } };
//     }

//     const motDePasse = await hashPassword(d.motDePasse);
//     const commercant = await prisma.commercant.create({
//         data: { ...d, motDePasse, essaiFinLe: new Date(Date.now() + 14 * 86_400_000) },
//         select: { id: true },
//     });

//     //await createSession(commercant.id);
//     redirect("/login");
// }

// export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
//     const parsed = loginSchema.safeParse(Object.fromEntries(formData));
//     if (!parsed.success) {
//         return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors) };
//     }
//     const { telephone, motDePasse } = parsed.data;

//     const commercant = await prisma.commercant.findUnique({
//         where: { telephone },
//         select: { id: true, motDePasse: true, role: true },
//     });

//     // message générique : on ne révèle pas si le téléphone existe
//     if (!commercant || !(await verifyPassword(motDePasse, commercant.motDePasse))) {
//         return { error: "Téléphone ou mot de passe incorrect" };
//     }

//     await createSession(commercant.id);
//     redirect(commercant.role === "ADMIN" ? "/messages" : "/dashboard");
// }

// export async function logoutAction() {
//     await destroySession();
//     redirect("/login");
// }