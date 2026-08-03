-- CreateEnum
CREATE TYPE "FormuleAbonnement" AS ENUM ('BASIQUE', 'BOUTIQUE');

-- AlterTable
ALTER TABLE "Commercant" ADD COLUMN     "formule" "FormuleAbonnement" NOT NULL DEFAULT 'BASIQUE';

-- AlterTable
ALTER TABLE "PaiementAbonnement" ADD COLUMN     "formule" "FormuleAbonnement" NOT NULL DEFAULT 'BASIQUE';
