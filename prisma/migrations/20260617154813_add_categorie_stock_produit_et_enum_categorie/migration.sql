/*
  Warnings:

  - Added the required column `stock` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategorieProduit" AS ENUM ('ALIMENTAIRE', 'BOISSONS', 'HYGIENE', 'VETEMENTS', 'AUTRES');

-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "categorie" "CategorieProduit" NOT NULL DEFAULT 'AUTRES',
ADD COLUMN     "stock" INTEGER NOT NULL;
