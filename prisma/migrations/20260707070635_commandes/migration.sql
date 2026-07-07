-- CreateEnum
CREATE TYPE "ModeCommande" AS ENUM ('LIVRAISON', 'RETRAIT');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('NOUVELLE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'RECUPEREE', 'LIVREE', 'REFUSEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutPaiementCommande" AS ENUM ('EN_ATTENTE', 'PAYEE');

-- CreateTable
CREATE TABLE "Acheteur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acheteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "acheteurId" INTEGER NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "mode" "ModeCommande" NOT NULL,
    "adresse" TEXT,
    "statut" "StatutCommande" NOT NULL DEFAULT 'NOUVELLE',
    "statutPaiement" "StatutPaiementCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "total" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneCommande" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "produitId" INTEGER,
    "nomProduit" TEXT NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "LigneCommande_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acheteur_telephone_key" ON "Acheteur"("telephone");

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_acheteurId_fkey" FOREIGN KEY ("acheteurId") REFERENCES "Acheteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
