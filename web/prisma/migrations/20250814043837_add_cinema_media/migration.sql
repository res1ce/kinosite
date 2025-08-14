-- Add description and images fields to Cinema
ALTER TABLE "Cinema" ADD COLUMN "description" TEXT;
ALTER TABLE "Cinema" ADD COLUMN "coverImageUrl" TEXT;
ALTER TABLE "Cinema" ADD COLUMN "galleryUrls" JSONB;
