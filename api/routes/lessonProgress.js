import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { LessonStatus } from '@prisma/client';
const r = Router();

/* POST /lesson-progress
   body: { lessonId, score, total }
   роль STUDENT
*/
r.post('/', authMw(['STUDENT']), async (req, res) => {
  const { lessonId, score, total } = req.body;
  const passed = score === total;

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId: req.user.id, lessonId: +lessonId },
    },
    update: {
      status: passed ? LessonStatus.COMPLETED : LessonStatus.IN_PROGRESS,
      meta:   { score, total },
    },
    create: {
      userId: req.user.id,
      lessonId: +lessonId,
      status: passed ? LessonStatus.COMPLETED : LessonStatus.IN_PROGRESS,
      meta: { score, total },
    },
  });

  res.json({ passed, score, total });
});

export default r;
