-- AlterTable
ALTER TABLE "AnalysisRequest" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "AnalysisRequest" ADD CONSTRAINT "AnalysisRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
