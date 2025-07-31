-- CreateTable
CREATE TABLE "public"."LessonComment" (
    "id" BIGSERIAL NOT NULL,
    "lessonId" BIGINT NOT NULL,
    "authorId" BIGINT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonComment_lessonId_idx" ON "public"."LessonComment"("lessonId");

-- AddForeignKey
ALTER TABLE "public"."LessonComment" ADD CONSTRAINT "LessonComment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LessonComment" ADD CONSTRAINT "LessonComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
