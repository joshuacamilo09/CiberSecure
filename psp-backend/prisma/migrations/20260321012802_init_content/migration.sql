-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('article', 'guide', 'faq', 'warning');

-- CreateTable
CREATE TABLE "ContentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentCategory_slug_key" ON "ContentCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ContentCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
