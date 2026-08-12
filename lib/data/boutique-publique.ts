import "server-only";

import { cache } from "react";
import prisma from "@/prisma/prisma";

const num = (d: unknown) => Number(d ?? 0);

export type VitrineProduit = {
  id: number;
  nom: string;
  prix: number;
  description: string;
  disponible: boolean;
  image: string | null;
  images: string[];
};

export type Vitrine = {
  nom: string;
  description: string;
  quartier: string;
  ville: string;
  telephone: string;
  livraison: boolean;
  retrait: boolean;
  produits: VitrineProduit[];
};

export const getBoutiquePublique = cache(
  async (
    slug: string
  ): Promise<{ active: false } | { active: true; vitrine: Vitrine; commercantId: number } | null> => {
  const boutique = await prisma.boutique.findUnique({
    where: { slug },
    select: {
      id: true,
      commercantId: true,
      nom: true,
      description: true,
      quartier: true,
      ville: true,
      telephone: true,
      estActive: true,
      livraisonDisponible: true,
      retraitDisponible: true,
    },
  });

  if (!boutique) return null;
  if (!boutique.estActive) return { active: false };

  const produits = await prisma.produit.findMany({
    where: { boutiqueId: boutique.id },
    orderBy: [{ disponible: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      nom: true,
      prix: true,
      description: true,
      disponible: true,
      images: { select: { url: true }, orderBy: { ordre: "asc" } },
    },
  });

  return {
    active: true,
    commercantId: boutique.commercantId,
    vitrine: {
      nom: boutique.nom,
      description: boutique.description ?? "",
      quartier: boutique.quartier ?? "",
      ville: boutique.ville ?? "",
      telephone: boutique.telephone,
      livraison: boutique.livraisonDisponible,
      retrait: boutique.retraitDisponible,
      produits: produits.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: num(p.prix),
        description: p.description ?? "",
        disponible: p.disponible,
        image: p.images[0]?.url ?? null,
        images: p.images.map((i) => i.url),
      })),
    },
  };
});