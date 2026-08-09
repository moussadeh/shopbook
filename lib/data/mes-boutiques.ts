import "server-only";

import prisma from "@/prisma/prisma";
import { getUtilisateurActuel } from "@/lib/auth/auth";

export type BoutiqueVisitee = {
  slug: string;
  nom: string;
  ville: string;
  quartier: string;
  nbCommandes: number;
  derniereCommande: string;
};

const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export async function getMesBoutiques(): Promise<BoutiqueVisitee[] | null> {
  const utilisateur = await getUtilisateurActuel();
  if (!utilisateur?.client) return null;

  // On regroupe les commandes du client par boutique
  const commandes = await prisma.commande.findMany({
    where: { clientId: utilisateur.client.id },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      boutique: { select: { slug: true, nom: true, ville: true, quartier: true, estActive: true } },
    },
  });

  const parBoutique = new Map<string, BoutiqueVisitee & { _date: Date }>();

  for (const c of commandes) {
    const b = c.boutique;
    if (!b) continue;
    const existant = parBoutique.get(b.slug);
    if (existant) {
      existant.nbCommandes += 1;
    } else {
      parBoutique.set(b.slug, {
        slug: b.slug,
        nom: b.nom,
        ville: b.ville ?? "",
        quartier: b.quartier ?? "",
        nbCommandes: 1,
        derniereCommande: fmt.format(c.createdAt),
        _date: c.createdAt,
      });
    }
  }

  // trié par commande la plus récente
  return [...parBoutique.values()]
    .sort((a, b) => b._date.getTime() - a._date.getTime())
    .map(({ _date, ...rest }) => rest);
}