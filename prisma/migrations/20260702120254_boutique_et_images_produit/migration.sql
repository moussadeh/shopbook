-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "visibleBoutique" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProduitImage" ADD COLUMN     "ordre" INTEGER NOT NULL DEFAULT 0;
