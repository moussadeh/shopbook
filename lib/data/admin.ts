import "server-only";

import prisma from "@/prisma/prisma";
import { StatutPaiementAbo } from "@/app/generated/prisma/client";

const fmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
});

export type MessageRow = {
  id: number;
  prenom: string; nom: string; name: string; initials: string;
  email: string; sujet: string; message: string;
  lu: boolean; date: string;
};

export async function getMessagesContact(): Promise<MessageRow[]> {
  const rows = await prisma.messageContact.findMany({
    orderBy: [{ lu: "asc" }, { createdAt: "desc" }], // non lus d'abord
  });
  return rows.map((m) => ({
    id: m.id,
    prenom: m.prenom, nom: m.nom,
    name: `${m.prenom} ${m.nom}`,
    initials: `${m.prenom[0] ?? ""}${m.nom[0] ?? ""}`.toUpperCase(),
    email: m.email, sujet: m.sujet, message: m.message,
    lu: m.lu, date: fmt.format(m.createdAt),
  }));
}

export type PaiementAboRow = {
  id: number;
  commercantId: number;
  commercantNom: string; boutique: string; initials: string;
  telephone: string; email: string;
  methode: string; montant: number; captureUrl: string;
  statut: StatutPaiementAbo; motifRejet: string | null;
  date: string;
};

export async function getPaiementsAbo(): Promise<PaiementAboRow[]> {
  const rows = await prisma.paiementAbonnement.findMany({
    orderBy: [{ statut: "asc" }, { createdAt: "desc" }], // EN_ATTENTE en premier
    select: {
      id: true, commercantId: true, methode: true, montant: true,
      captureUrl: true, statut: true, motifRejet: true, createdAt: true,
      commercant: { select: { prenom: true, nom: true, nomBoutique: true, telephone: true, email: true } },
    },
  });
  return rows.map((p) => ({
    id: p.id,
    commercantId: p.commercantId,
    commercantNom: `${p.commercant.prenom} ${p.commercant.nom}`,
    boutique: p.commercant.nomBoutique,
    initials: `${p.commercant.prenom[0] ?? ""}${p.commercant.nom[0] ?? ""}`.toUpperCase(),
    telephone: p.commercant.telephone,
    email: p.commercant.email,
    methode: p.methode,
    montant: p.montant,
    captureUrl: p.captureUrl,
    statut: p.statut,
    motifRejet: p.motifRejet,
    date: fmt.format(p.createdAt),
  }));
}