-- AddForeignKey
ALTER TABLE "public"."LessonComment" ADD CONSTRAINT "LessonComment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
