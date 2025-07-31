import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { LessonStatus } from '@prisma/client';

const r = Router();

// GET /lessonComments/:lessonId — получить все комментарии к уроку
r.get('/:lessonId', authMw(), async (req, res) => {
  const lessonId = +req.params.lessonId;
  const comments = await prisma.lessonComment.findMany({
    where: { lessonId },
    include: { author: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(comments);
});

// POST /lessonComments/:lessonId — добавить комментарий и поставить статус NEED_CLARIFY
r.post('/:lessonId', authMw(['STUDENT']), async (req, res) => {
  const lessonId = +req.params.lessonId;
  const { text } = req.body;
  const userId = req.user.id;

  await prisma.$transaction([
    prisma.lessonComment.create({
      data: { lessonId, authorId: userId, text },
    }),
    prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { status: LessonStatus.NEED_CLARIFY },
      create: { userId, lessonId, status: LessonStatus.NEED_CLARIFY },
    }),
  ]);

  const comments = await prisma.lessonComment.findMany({
    where: { lessonId },
    include: { author: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.status(201).json(comments);
});

export default r;
