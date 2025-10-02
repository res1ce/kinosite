-- AlterTable
ALTER TABLE "public"."PriceItem" ADD COLUMN     "features" TEXT,
ADD COLUMN     "iconType" TEXT DEFAULT 'star',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
