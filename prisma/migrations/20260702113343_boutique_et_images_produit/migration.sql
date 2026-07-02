-- AlterTable
ALTER TABLE "Boutique" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "livraison" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "retrait" BOOLEAN NOT NULL DEFAULT true;
