import "server-only";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";

export type ProduitImageRow = { id: number; url: string };

export type ProduitRow = {
  id: number;
  nom: string;
  prix: number;
  description: string;
  disponible: boolean;
  images: ProduitImageRow[];
  image: string | null; // 1re image (raccourci pour la liste)
};

export async function getProduits(): Promise<ProduitRow[]> {
  const commercantId = await getCommercantId();

  const rows = await prisma.produit.findMany({
    where: { commercantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nom: true,
      prix: true,
      description: true,
      disponible: true,
      images: { select: { id: true, url: true }, orderBy: { ordre: "asc" } },
    },
  });

  return rows.map((p) => ({
    id: p.id,
    nom: p.nom,
    prix: p.prix,
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
  const commercantId = await getCommercantId();

  const [total, disponibles, avecImage] = await Promise.all([
    prisma.produit.count({ where: { commercantId } }),
    prisma.produit.count({ where: { commercantId, disponible: true } }),
    prisma.produit.count({ where: { commercantId, images: { some: {} } } }),
  ]);

  return { total, disponibles, indisponibles: total - disponibles, avecImage };
}



// import "server-only";

// import prisma from "@/prisma/prisma";
// import { getCommercantId } from "@/lib/auth/auth";
// import { CategorieProduit, UniteProduit } from "@/app/generated/prisma/client";
// import { STOCK_BAS_SEUIL } from "@/lib/donnes/produits";

// export type ProduitImageRow = { id: number; url: string };

// export type ProduitRow = {
//   id: number;
//   nom: string;
//   categorie: CategorieProduit;
//   prixUnitaire: number;
//   unite: UniteProduit;
//   stock: number;
//   vendu: number;
//   visibleBoutique: boolean;
//   images: ProduitImageRow[];
// };

// export async function getProduits(): Promise<ProduitRow[]> {
//   const commercantId = await getCommercantId();

//   const rows = await prisma.produit.findMany({
//     where: { commercantId },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       nom: true,
//       categorie: true,
//       prixUnitaire: true,
//       unite: true,
//       stock: true,
//       visibleBoutique: true,
//       credits: { select: { quantite: true } },
//       images: { select: { id: true, url: true }, orderBy: { ordre: "asc" } },
//     },
//   });

//   return rows.map((p) => ({
//     id: p.id,
//     nom: p.nom,
//     categorie: p.categorie,
//     prixUnitaire: p.prixUnitaire,
//     unite: p.unite,
//     stock: p.stock,
//     vendu: p.credits.reduce((sum, cp) => sum + cp.quantite, 0),
//     visibleBoutique: p.visibleBoutique,
//     images: p.images,
//   }));
// }

// export type ProduitsStats = {
//   totalProduits: number;
//   valeurStock: number;
//   stockBas: number;
//   totalVendu: number;
// };

// export async function getProduitsStats(): Promise<ProduitsStats> {
//   const commercantId = await getCommercantId();

//   const [totalProduits, stockBas, produits, vendu] = await Promise.all([
//     prisma.produit.count({ where: { commercantId } }),
//     prisma.produit.count({ where: { commercantId, stock: { lt: STOCK_BAS_SEUIL } } }),
//     prisma.produit.findMany({
//       where: { commercantId },
//       select: { prixUnitaire: true, stock: true },
//     }),
//     prisma.creditProduit.aggregate({
//       where: { credit: { commercantId } },
//       _sum: { quantite: true },
//     }),
//   ]);

//   const valeurStock = produits.reduce((sum, p) => sum + p.prixUnitaire * p.stock, 0);

//   return {
//     totalProduits,
//     valeurStock,
//     stockBas,
//     totalVendu: vendu._sum.quantite ?? 0,
//   };
// }