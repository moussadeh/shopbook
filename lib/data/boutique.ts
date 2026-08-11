import "server-only";
import prisma from "@/prisma/prisma";
import { exigerCommercant } from "@/lib/auth/auth";

export type BoutiqueRow = {
  id: number;
  slug: string;
  nom: string;
  description: string;
  quartier: string;
  ville: string;
  telephone: string;
  estActive: boolean;
  livraisonDisponible: boolean;
  retraitDisponible: boolean;
};

export async function getMaBoutique(): Promise<BoutiqueRow | null> {
  const commercantId = await exigerCommercant();

  const b = await prisma.boutique.findUnique({ where: { commercantId } });
  if (!b) return null;

  return {
    id: b.id,
    slug: b.slug,
    nom: b.nom,
    description: b.description ?? "",
    quartier: b.quartier ?? "",
    ville: b.ville ?? "",
    telephone: b.telephone,
    estActive: b.estActive,
    livraisonDisponible: b.livraisonDisponible,
    retraitDisponible: b.retraitDisponible,
  };
}