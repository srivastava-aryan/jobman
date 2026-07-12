-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "tailoredResumeId" TEXT;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_tailoredResumeId_fkey" FOREIGN KEY ("tailoredResumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
