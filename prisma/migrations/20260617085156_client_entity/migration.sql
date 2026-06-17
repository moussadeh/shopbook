-- CreateEnum
CREATE TYPE "StatutCredit" AS ENUM ('NON_PAYE', 'EN_COURS', 'PAYE');

-- CreateEnum
CREATE TYPE "UniteProduit" AS ENUM ('SAC', 'KILO', 'LIBAR', 'LITRE', 'SACHET', 'CARTON', 'BOITE', 'BOUTEILLE', 'BIDON', 'METRE', 'PAQUET');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
