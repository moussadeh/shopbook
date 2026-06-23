-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('BANKILY', 'MASRVI', 'SEDAD', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutPaiementAbo" AS ENUM ('EN_ATTENTE', 'APPROUVE', 'REJETE');

-- AlterTable
ALTER TABLE "Commercant" ADD COLUMN     "abonneJusquau" TIMESTAMP(3),
ADD COLUMN     "essaiFinLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "PaiementAbonnement" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "methode" "MethodePaiement" NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "captureUrl" TEXT NOT NULL,
    "statut" "StatutPaiementAbo" NOT NULL DEFAULT 'EN_ATTENTE',
    "motifRejet" TEXT,
    "verifieLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaiementAbonnement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaiementAbonnement" ADD CONSTRAINT "PaiementAbonnement_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
