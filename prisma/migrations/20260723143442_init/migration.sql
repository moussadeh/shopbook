-- CreateEnum
CREATE TYPE "StatutCredit" AS ENUM ('NON_PAYE', 'EN_COURS', 'PAYE');

-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('BANKILY', 'MASRVI', 'SEDAD', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutPaiementAbonnement" AS ENUM ('EN_ATTENTE', 'APPROUVE', 'REJETE');

-- CreateEnum
CREATE TYPE "ModeCommande" AS ENUM ('LIVRAISON', 'RETRAIT');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('NOUVELLE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'RECUPEREE', 'LIVREE', 'REFUSEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutPaiementCommande" AS ENUM ('EN_ATTENTE', 'PAYEE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "estAdmin" BOOLEAN NOT NULL DEFAULT false,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commercant" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "description" TEXT,
    "ville" TEXT,
    "quartier" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'Mauritanie',
    "finEssaiGratuit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finAbonnement" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commercant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "adresse" TEXT,
    "quartier" TEXT,
    "ville" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'Mauritanie',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emprunteur" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emprunteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "emprunteurId" INTEGER NOT NULL,
    "montantTotal" DECIMAL(12,2) NOT NULL,
    "montantPaye" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "statutCredit" "StatutCredit" NOT NULL DEFAULT 'NON_PAYE',
    "dateCredit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boutique" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "telephone" TEXT NOT NULL,
    "quartier" TEXT,
    "ville" TEXT,
    "logoUrl" TEXT,
    "couvertureUrl" TEXT,
    "estActive" BOOLEAN NOT NULL DEFAULT true,
    "livraisonDisponible" BOOLEAN NOT NULL DEFAULT false,
    "retraitDisponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boutique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "boutiqueId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" DECIMAL(12,2) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageProduit" (
    "id" SERIAL NOT NULL,
    "produitId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageProduit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "boutiqueId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "nomDestinataire" TEXT NOT NULL,
    "telephoneDestinataire" TEXT NOT NULL,
    "adresseLivraison" TEXT,
    "quartierLivraison" TEXT,
    "villeLivraison" TEXT,
    "commentaire" TEXT,
    "montantTotal" DECIMAL(12,2) NOT NULL,
    "mode" "ModeCommande" NOT NULL,
    "statutCommande" "StatutCommande" NOT NULL DEFAULT 'NOUVELLE',
    "statutPaiement" "StatutPaiementCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneCommande" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "nomProduit" TEXT NOT NULL,
    "prixUnitaire" DECIMAL(12,2) NOT NULL,
    "quantite" INTEGER NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "LigneCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaiementAbonnement" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "methodePaiement" "MethodePaiement" NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "justificatifUrl" TEXT NOT NULL,
    "statut" "StatutPaiementAbonnement" NOT NULL DEFAULT 'EN_ATTENTE',
    "motifRejet" TEXT,
    "nombreMois" INTEGER NOT NULL DEFAULT 1,
    "dateVerification" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaiementAbonnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageContact" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "sujet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "repondu" BOOLEAN NOT NULL DEFAULT false,
    "dateLecture" TIMESTAMP(3),
    "dateReponse" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_telephone_key" ON "Utilisateur"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Commercant_utilisateurId_key" ON "Commercant"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_utilisateurId_key" ON "Client"("utilisateurId");

-- CreateIndex
CREATE INDEX "Emprunteur_commercantId_idx" ON "Emprunteur"("commercantId");

-- CreateIndex
CREATE INDEX "Credit_commercantId_idx" ON "Credit"("commercantId");

-- CreateIndex
CREATE INDEX "Credit_emprunteurId_idx" ON "Credit"("emprunteurId");

-- CreateIndex
CREATE INDEX "Paiement_creditId_idx" ON "Paiement"("creditId");

-- CreateIndex
CREATE UNIQUE INDEX "Boutique_commercantId_key" ON "Boutique"("commercantId");

-- CreateIndex
CREATE UNIQUE INDEX "Boutique_slug_key" ON "Boutique"("slug");

-- CreateIndex
CREATE INDEX "Produit_boutiqueId_idx" ON "Produit"("boutiqueId");

-- CreateIndex
CREATE INDEX "ImageProduit_produitId_idx" ON "ImageProduit"("produitId");

-- CreateIndex
CREATE INDEX "Commande_boutiqueId_idx" ON "Commande"("boutiqueId");

-- CreateIndex
CREATE INDEX "Commande_clientId_idx" ON "Commande"("clientId");

-- CreateIndex
CREATE INDEX "LigneCommande_commandeId_idx" ON "LigneCommande"("commandeId");

-- CreateIndex
CREATE INDEX "LigneCommande_produitId_idx" ON "LigneCommande"("produitId");

-- CreateIndex
CREATE INDEX "PaiementAbonnement_commercantId_idx" ON "PaiementAbonnement"("commercantId");

-- AddForeignKey
ALTER TABLE "Commercant" ADD CONSTRAINT "Commercant_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprunteur" ADD CONSTRAINT "Emprunteur_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_emprunteurId_fkey" FOREIGN KEY ("emprunteurId") REFERENCES "Emprunteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boutique" ADD CONSTRAINT "Boutique_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_boutiqueId_fkey" FOREIGN KEY ("boutiqueId") REFERENCES "Boutique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageProduit" ADD CONSTRAINT "ImageProduit_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_boutiqueId_fkey" FOREIGN KEY ("boutiqueId") REFERENCES "Boutique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaiementAbonnement" ADD CONSTRAINT "PaiementAbonnement_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
