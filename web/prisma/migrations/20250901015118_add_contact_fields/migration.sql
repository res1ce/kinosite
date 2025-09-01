-- AlterTable
ALTER TABLE "public"."SiteContent" ADD COLUMN     "contactEmail" TEXT NOT NULL DEFAULT 'info@kino.ru',
ADD COLUMN     "contactPhone" TEXT NOT NULL DEFAULT '+7 (999) 123-45-67';
