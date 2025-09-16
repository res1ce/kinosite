/*
  Warnings:

  - The values [Архитектура,Природа,Студия] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Category_new" AS ENUM ('ARCHITECTURE', 'NATURE', 'STUDIO');
ALTER TABLE "public"."Location" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "public"."Location" ALTER COLUMN "category" TYPE "public"."Category_new" USING ("category"::text::"public"."Category_new");
ALTER TYPE "public"."Category" RENAME TO "Category_old";
ALTER TYPE "public"."Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
ALTER TABLE "public"."Location" ALTER COLUMN "category" SET DEFAULT 'ARCHITECTURE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Location" ALTER COLUMN "category" SET DEFAULT 'ARCHITECTURE';

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);
