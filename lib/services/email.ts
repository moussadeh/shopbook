import "server-only";
import prisma from "@/prisma/prisma";

export async function notifierAdminNouveauPaiement(params: {
  commercantId: number;
  methode: string;
  montant: number;
}) {
  const c = await prisma.commercant.findUnique({
    where: { id: params.commercantId },
    select: { prenom: true, nom: true, nomBoutique: true, telephone: true, email: true },
  });

  console.log("[email → admin] Nouveau paiement d'abonnement à vérifier :", {
    destinataire: "admin@shopbook.mr",
    sujet: "Nouveau paiement d'abonnement",
    commercant: c ? `${c.prenom} ${c.nom}` : `#${params.commercantId}`,
    boutique: c?.nomBoutique,
    contact: `${c?.telephone} · ${c?.email}`,
    methode: params.methode,
    montant: `${params.montant} MRU`,
    date: new Date().toLocaleString("fr-FR"),
  });
}