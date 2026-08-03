/*
  Warnings:

  - You are about to drop the column `formule` on the `Commercant` table. All the data in the column will be lost.
  - You are about to drop the column `formule` on the `PaiementAbonnement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commercant" DROP COLUMN "formule";

-- AlterTable
ALTER TABLE "PaiementAbonnement" DROP COLUMN "formule";

-- DropEnum
DROP TYPE "FormuleAbonnement";
