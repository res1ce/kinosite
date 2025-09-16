-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ARCHITECTURE', 'NATURE', 'STUDIO');

-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "category" "public"."Category" NOT NULL DEFAULT 'ARCHITECTURE';
