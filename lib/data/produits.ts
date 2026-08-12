import "server-only";

import { cache } from "react";
import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";

const num = (d: unknown) => Number(d ?? 0);

export type ProduitImageRow = { id: number; url: string };

export type ProduitRow = {
  id: number;
  nom: string;
  prix: number;
  description: string;
  disponible: boolean;
  images: ProduitImageRow[];
  image: string | null;
};

/** Retourne l'id de la boutique du commerçant, ou null s'il n'en a pas encore */
export const getBoutiqueId = cache(async (): Promise<number | null> => {
  const commercantId = await exigerCommercant();
  const b = await prisma.boutique.findUnique({
    where: { commercantId },
    select: { id: true },
  });
  return b?.id ?? null;
});

export async function getProduits(): Promise<ProduitRow[]> {
  const boutiqueId = await getBoutiqueId();
  if (!boutiqueId) return [];

  const rows = await prisma.produit.findMany({
    where: { boutiqueId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, nom: true, prix: true, description: true, disponible: true,
      images: { select: { id: true, url: true }, orderBy: { ordre: "asc" } },
    },
  });

  return rows.map((p) => ({
    id: p.id,
    nom: p.nom,
    prix: num(p.prix),
    description: p.description ?? "",
    disponible: p.disponible,
    images: p.images,
    image: p.images[0]?.url ?? null,
  }));
}

export type ProduitsStats = {
  total: number;
  disponibles: number;
  indisponibles: number;
  avecImage: number;
};

export async function getProduitsStats(): Promise<ProduitsStats> {
  const boutiqueId = await getBoutiqueId();
  if (!boutiqueId) return { total: 0, disponibles: 0, indisponibles: 0, avecImage: 0 };

  const [total, disponibles, avecImage] = await Promise.all([
    prisma.produit.count({ where: { boutiqueId } }),
    prisma.produit.count({ where: { boutiqueId, disponible: true } }),
    prisma.produit.count({ where: { boutiqueId, images: { some: {} } } }),
  ]);

  return { total, disponibles, indisponibles: total - disponibles, avecImage };
}