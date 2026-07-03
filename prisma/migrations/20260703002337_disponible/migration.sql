/*
  Warnings:

  - You are about to drop the column `prixUnitaire` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `unite` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `visibleBoutique` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the `CreditProduit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prix` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditProduit" DROP CONSTRAINT "CreditProduit_creditId_fkey";

-- DropForeignKey
ALTER TABLE "CreditProduit" DROP CONSTRAINT "CreditProduit_produitId_fkey";

-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "prixUnitaire",
DROP COLUMN "stock",
DROP COLUMN "unite",
DROP COLUMN "visibleBoutique",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "disponible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prix" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "CreditProduit";

-- DropEnum
DROP TYPE "UniteProduit";
