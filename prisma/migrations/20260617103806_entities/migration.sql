-- CreateTable
CREATE TABLE "Commercant" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "nomBoutique" TEXT NOT NULL,
    "description" TEXT,
    "ville" TEXT NOT NULL,
    "quartier" TEXT NOT NULL,
    "pays" TEXT NOT NULL,
    "isAbonne" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commercant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "montantTotal" DOUBLE PRECISION NOT NULL,
    "montantPaye" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statutCredit" "StatutCredit" NOT NULL DEFAULT 'NON_PAYE',
    "dateCredit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "commercantId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "unite" "UniteProduit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditProduit" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "montantTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CreditProduit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Commercant_telephone_key" ON "Commercant"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Commercant_email_key" ON "Commercant"("email");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_commercantId_fkey" FOREIGN KEY ("commercantId") REFERENCES "Commercant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditProduit" ADD CONSTRAINT "CreditProduit_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditProduit" ADD CONSTRAINT "CreditProduit_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
