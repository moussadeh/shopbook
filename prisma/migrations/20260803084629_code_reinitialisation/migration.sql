-- CreateTable
CREATE TABLE "CodeReinitialisation" (
    "id" SERIAL NOT NULL,
    "telephone" TEXT NOT NULL,
    "codeHache" TEXT NOT NULL,
    "expireLe" TIMESTAMP(3) NOT NULL,
    "utilise" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeReinitialisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeReinitialisation_telephone_idx" ON "CodeReinitialisation"("telephone");
