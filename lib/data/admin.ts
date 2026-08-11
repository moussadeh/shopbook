import "server-only";

import prisma from "@/prisma/prisma";
import { StatutPaiementAbonnement } from "@/app/generated/prisma/client";
import { getCaptureUrl } from "../services/storage";

const num = (d: unknown) => Number(d ?? 0);

const fmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
});

export type MessageRow = {
  id: number;
  prenom: string; nom: string; name: string; initials: string;
  email: string | null;
  telephone: string | null;
  sujet: string; message: string;
  lu: boolean; repondu: boolean; date: string;
};

export async function getMessagesContact(): Promise<MessageRow[]> {
  const rows = await prisma.messageContact.findMany({
    orderBy: [{ lu: "asc" }, { createdAt: "desc" }], // non lus d'abord
  });

  return rows.map((m) => ({
    id: m.id,
    prenom: m.prenom,
    nom: m.nom,
    name: `${m.prenom} ${m.nom}`,
    initials: `${m.prenom[0] ?? ""}${m.nom[0] ?? ""}`.toUpperCase(),
    email: m.email,
    telephone: m.telephone,
    sujet: m.sujet,
    message: m.message,
    lu: m.lu,
    repondu: m.repondu,
    date: fmt.format(m.createdAt),
  }));
}

export type PaiementAboRow = {
  id: number;
  commercantId: number;
  commercantNom: string;
  boutique: string;
  initials: string;
  telephone: string;
  methode: string;
  montant: number;
  nombreMois: number;
  justificatifUrl: string | null;
  statut: StatutPaiementAbonnement;
  motifRejet: string | null;
  date: string;
};

export async function getPaiementsAbo(): Promise<PaiementAboRow[]> {
  const rows = await prisma.paiementAbonnement.findMany({
    orderBy: [{ statut: "asc" }, { createdAt: "desc" }], // EN_ATTENTE en premier
    select: {
      id: true, commercantId: true, methodePaiement: true, montant: true,
      nombreMois: true, justificatifUrl: true, statut: true, motifRejet: true, createdAt: true,
      commercant: {
        select: {
          utilisateur: { select: { prenom: true, nom: true, telephone: true } },
          boutique: { select: { nom: true } },
        },
      },
    },
  });

  return Promise.all(
    rows.map(async (p) => {
      const u = p.commercant.utilisateur;
      return {
        id: p.id,
        commercantId: p.commercantId,
        commercantNom: `${u.prenom} ${u.nom}`,
        boutique: p.commercant.boutique?.nom ?? "Sans boutique",
        initials: `${u.prenom[0] ?? ""}${u.nom[0] ?? ""}`.toUpperCase(),
        telephone: u.telephone,
        methode: p.methodePaiement,
        montant: num(p.montant),
        nombreMois: p.nombreMois,
        justificatifUrl: await getCaptureUrl(p.justificatifUrl),
        statut: p.statut,
        motifRejet: p.motifRejet,
        date: fmt.format(p.createdAt),
      };
    })
  );
}