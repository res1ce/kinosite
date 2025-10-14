-- AlterTable
ALTER TABLE "public"."SiteContent" ADD COLUMN     "regionVideoFile" TEXT;

-- AlterTable
ALTER TABLE "public"."team_members" ALTER COLUMN "description" SET DEFAULT '123';
