/*
  Warnings:

  - The values [ARCHITECTURE,NATURE,STUDIO] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Category_new" AS ENUM ('Архитектура', 'Природа', 'Студия');
ALTER TABLE "public"."Location" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "public"."Location" ALTER COLUMN "category" TYPE "public"."Category_new" USING ("category"::text::"public"."Category_new");
ALTER TYPE "public"."Category" RENAME TO "Category_old";
ALTER TYPE "public"."Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
ALTER TABLE "public"."Location" ALTER COLUMN "category" SET DEFAULT 'Архитектура';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Location" ALTER COLUMN "category" SET DEFAULT 'Архитектура';
