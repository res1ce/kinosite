-- CreateTable
CREATE TABLE "public"."SiteContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT 'main',
    "heroText" TEXT NOT NULL,
    "feature1Number" TEXT NOT NULL,
    "feature1Label" TEXT NOT NULL,
    "feature2Number" TEXT NOT NULL,
    "feature2Label" TEXT NOT NULL,
    "feature3Number" TEXT NOT NULL,
    "feature3Label" TEXT NOT NULL,
    "footerDescription" TEXT NOT NULL,
    "footerContacts" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_slug_key" ON "public"."SiteContent"("slug");
