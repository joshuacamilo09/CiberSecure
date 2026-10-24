-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "AnalysisInputType" AS ENUM ('text', 'image', 'mixed', 'quick_action');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('pending', 'processed', 'failed');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('cyberbullying', 'harassment', 'threat', 'image_exposure', 'impersonation', 'other');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('draft', 'submitted', 'archived');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant', 'system');

-- CreateTable
CREATE TABLE "PspCenter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "openingHours" TEXT,
    "supportsCybercrime" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PspCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "content" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickAction" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "recommendedFlow" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisRequest" (
    "id" TEXT NOT NULL,
    "inputType" "AnalysisInputType" NOT NULL,
    "originalText" TEXT,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'pending',
    "severity" "SeverityLevel",
    "classification" TEXT,
    "aiSummary" TEXT,
    "recommendedActions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedEvidence" (
    "id" TEXT NOT NULL,
    "analysisRequestId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "analysisRequestId" TEXT,
    "type" "ReportType" NOT NULL,
    "description" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "status" "ReportStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportResource_slug_key" ON "SupportResource"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "QuickAction_slug_key" ON "QuickAction"("slug");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedEvidence" ADD CONSTRAINT "UploadedEvidence_analysisRequestId_fkey" FOREIGN KEY ("analysisRequestId") REFERENCES "AnalysisRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_analysisRequestId_fkey" FOREIGN KEY ("analysisRequestId") REFERENCES "AnalysisRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
