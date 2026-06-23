-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMMERCANT', 'ADMIN');

-- AlterTable
ALTER TABLE "Commercant" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'COMMERCANT';
