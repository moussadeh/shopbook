"use server";

import prisma from "@/prisma/prisma";
import { contactSchema } from "@/lib/validations/contact";

export type ContactState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
  values?: Record<string, string>;
};

function toFieldErrors(flatten: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const k in flatten) if (flatten[k]?.[0]) out[k] = flatten[k]![0];
  return out;
}

export async function envoyerMessageContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors), values: raw };
  }

  try {
    await prisma.messageContact.create({ data: parsed.data });
  } catch (e) {
    console.error("Erreur création message contact:", e);
    return { error: "Une erreur est survenue. Réessayez plus tard.", values: raw };
  }

  return { success: true };
}