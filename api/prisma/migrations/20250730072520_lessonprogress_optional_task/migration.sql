-- DropForeignKey
ALTER TABLE "public"."FileSubmission" DROP CONSTRAINT "FileSubmission_taskId_fkey";

-- AlterTable
ALTER TABLE "public"."FileSubmission" ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FileSubmission" ADD CONSTRAINT "FileSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
