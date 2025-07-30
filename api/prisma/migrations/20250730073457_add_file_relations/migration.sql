/*
  Warnings:

  - Added the required column `lessonId` to the `FileSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `FileSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FileSubmission" ADD COLUMN     "lessonId" BIGINT NOT NULL,
ADD COLUMN     "studentId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FileSubmission" ADD CONSTRAINT "FileSubmission_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileSubmission" ADD CONSTRAINT "FileSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
