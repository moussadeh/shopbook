import "server-only";
import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";

export type BoutiqueRow = {
  id: number;
  slug: string;
  nom: string;
  description: string;
  quartier: string;
  telephone: string;
  active: boolean;
  livraison: boolean;
  retrait: boolean;
};

export async function getMaBoutique(): Promise<BoutiqueRow | null> {
  const commercantId = await getCommercantId();
  const b = await prisma.boutique.findUnique({ where: { commercantId } });
  if (!b) return null;
  return {
    id: b.id,
    slug: b.slug,
    nom: b.nom,
    description: b.description ?? "",
    quartier: b.quartier ?? "",
    telephone: b.telephone ?? "",
    active: b.active,
    livraison: b.livraison,
    retrait: b.retrait,
  };
}