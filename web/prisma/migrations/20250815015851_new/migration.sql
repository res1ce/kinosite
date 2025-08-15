/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `PriceItem` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `PriceItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Location" DROP COLUMN "coverImageUrl";

-- AlterTable
ALTER TABLE "public"."PriceItem" DROP COLUMN "amount",
DROP COLUMN "currency";

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
