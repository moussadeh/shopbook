import "server-only";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prisma";
import { getSession } from "./session";

/** Lecture souple — ne redirige pas (pages publiques : vitrine, landing) */
export async function getUtilisateurActuel() {
  const session = await getSession();
  if (!session) return null;

  return prisma.utilisateur.findUnique({
    where: { id: session.utilisateurId },
    select: {
      id: true, prenom: true, nom: true, telephone: true, actif: true, estAdmin: true,
      commercant: { select: { id: true } },
      client: { select: { id: true } },
    },
  });
}

/** Exige une connexion — renvoie l'id de l'utilisateur */
export async function exigerUtilisateur(): Promise<number> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.utilisateurId;
}

/** Exige un profil commerçant — renvoie son commercantId */
export async function exigerCommercant(): Promise<number> {
  const u = await getUtilisateurActuel();
  if (!u) redirect("/login");
  if (!u.commercant) redirect("/");
  return u.commercant.id;
}

/** Exige un profil client — renvoie son clientId (le crée si absent) */
export async function exigerClient(): Promise<number> {
  const u = await getUtilisateurActuel();
  if (!u) redirect("/login");
  if (u.client) return u.client.id;

  // un commerçant qui commande obtient son profil client à la volée
  const client = await prisma.client.create({
    data: { utilisateurId: u.id },
    select: { id: true },
  });
  return client.id;
}

/** Exige les droits admin */
export async function exigerAdmin(): Promise<number> {
  const u = await getUtilisateurActuel();
  if (!u) redirect("/login");
  if (!u.estAdmin) redirect("/");
  return u.id;
}