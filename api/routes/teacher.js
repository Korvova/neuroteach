import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { json }   from '../utils/jsonBigInt.js';
import { LessonStatus } from '@prisma/client';

const r = Router();

// включаем в ответ и course.title, и filePath, и meta.question
const baseSelect = {
  user: { select: { id: true, firstName: true, lastName: true } },
  lesson: {
    select: {
      id: true,
      title: true,
      course: { select: { id: true, title: true } },
    },
  },
  status: true,
  meta: true,
  // убрали submission
};




r.get('/review', authMw(['TEACHER']), async (_req, res) => {
  const rows = await prisma.lessonProgress.findMany({
    where: { status: LessonStatus.ON_REVIEW },
    select: baseSelect,
  });
  res.json(json(rows));
});


// отвечаем + сохраняем комментарий и опциональный файл
r.patch('/review/:userId/:lessonId', authMw(['TEACHER']), async (req, res) => {
  const { action, comment } = req.body;
  const { userId, lessonId } = req.params;
  const newStatus =
    action === 'READY' ? LessonStatus.COMPLETED : LessonStatus.NEED_REWORK;

  await prisma.$transaction([
    prisma.lessonProgress.update({
      where: { userId_lessonId: { userId:+userId, lessonId:+lessonId } },
      data: { status: newStatus },
    }),
    comment
      ? prisma.fileSubmission.create({
          data: {
            lessonId: +lessonId,
            studentId: +userId,
            filePath: '',        // если нужно сохранить файл, сюда путь
            comment,
            teacherId: req.user.id,
          }
        })
      : prisma.fileSubmission.findFirst()
  ]);

  res.json({ ok:true });
});








r.get(
  '/review/:userId/:lessonId/submission',
  authMw(['TEACHER']),
  async (req, res) => {
    const userId   = +req.params.userId;
    const lessonId = +req.params.lessonId;
    const sub = await prisma.fileSubmission.findFirst({
      where: { studentId: userId, lessonId },
      orderBy: { createdAt: 'desc' },
      select: { filePath: true, comment: true, createdAt: true }
    });
    res.json(json(sub)); // { filePath, comment, createdAt } или null
  }
);









// GET /api/teacher/clarify — уроки, где status = NEED_CLARIFY
r.get('/clarify', authMw(['TEACHER']), async (req, res) => {
  const list = await prisma.lessonProgress.findMany({
    where: { status: 'NEED_CLARIFY' },
    include: {
      lesson: {
        include: { course: true }
      },
      user: true
    }
  });
  res.json(json(list));  // массив LessonProgress
});






r.patch('/clarify/:userId/:lessonId', authMw(['TEACHER']), async (req, res) => {
  const { reply } = req.body;
  const { userId, lessonId } = req.params;
  await prisma.lessonProgress.update({
    where: { userId_lessonId:{ userId:+userId, lessonId:+lessonId } },
    data: {
      status: LessonStatus.IN_PROGRESS,
      meta: { question: req.body.question, reply } // сохраняем reply
    }
  });
  res.json({ ok:true });
});

export default r;
