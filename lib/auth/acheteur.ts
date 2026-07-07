import "server-only";
import prisma from "@/prisma/prisma";
import { getAcheteurSession } from "./acheteur-session";

// Lecture souple — PAS de redirection (la vitrine reste publique)
export async function getAcheteurId(): Promise<number | null> {
  const session = await getAcheteurSession();
  return session?.acheteurId ?? null;
}

export async function getAcheteur() {
  const id = await getAcheteurId();
  if (!id) return null;
  return prisma.acheteur.findUnique({
    where: { id },
    select: { id: true, nom: true, telephone: true },
  });
}