import "server-only";

import prisma from "@/prisma/prisma";

export type VitrineProduit = {
  id: number;
  nom: string;
  prix: number;
  description: string;
  categorie: string;
  disponible: boolean;
  image: string | null;
  images: string[];
};

export type Vitrine = {
  nom: string;
  description: string;
  quartier: string;
  telephone: string;
  livraison: boolean;
  retrait: boolean;
  produits: VitrineProduit[];
};

// null = slug introuvable ; { active:false } = boutique fermée
export async function getBoutiquePublique(
  slug: string
): Promise<{ active: false } | { active: true; vitrine: Vitrine } | null> {
  const boutique = await prisma.boutique.findUnique({
    where: { slug },
    select: {
      commercantId: true,
      nom: true,
      description: true,
      quartier: true,
      telephone: true,
      active: true,
      livraison: true,
      retrait: true,
    },
  });

  if (!boutique) return null;
  if (!boutique.active) return { active: false };

  const produits = await prisma.produit.findMany({
    where: { commercantId: boutique.commercantId },
    orderBy: [{ disponible: "desc" }, { createdAt: "desc" }], // dispo d'abord
    select: {
      id: true,
      nom: true,
      prix: true,
      description: true,
      categorie: true,
      disponible: true,
      images: { select: { url: true }, orderBy: { ordre: "asc" } },
    },
  });

  return {
    active: true,
    vitrine: {
      nom: boutique.nom,
      description: boutique.description ?? "",
      quartier: boutique.quartier ?? "",
      telephone: boutique.telephone ?? "",
      livraison: boutique.livraison,
      retrait: boutique.retrait,
      produits: produits.map((p) => ({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        description: p.description ?? "",
        categorie: p.categorie,
        disponible: p.disponible,
        image: p.images[0]?.url ?? null,
        images: p.images.map((i) => i.url),
      })),
    },
  };
}