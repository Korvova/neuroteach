import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { json } from '../utils/jsonBigInt.js';
import { LessonStatus } from '@prisma/client';

const r = Router();

/* helper: компактное представление */
const selectProgress = {
  user:   { select: { id: true, firstName: true, lastName: true, email: true } },
  lesson: { select: { id: true, title: true } },
  status: true,
  meta:   true,
};

/* ───────────────────────── REVIEW ─────────────────────────
   GET  /teacher/review
   Уроки со статусом ON_REVIEW  (файл загружен, ждёт проверки)
─────────────────────────────────────────────────────────── */
r.get('/review', authMw(['TEACHER']), async (_req, res) => {
  const rows = await prisma.lessonProgress.findMany({
    where: { status: LessonStatus.ON_REVIEW },
   select:  selectProgress,
  });
  res.json(json(rows));
});

/* PATCH /teacher/review/:userId/:lessonId
   body: { action:"READY" | "RETURN", comment? }
─────────────────────────────────────────────────────────── */
r.patch('/review/:userId/:lessonId', authMw(['TEACHER']), async (req, res) => {
  const { action, comment } = req.body;
  const { userId, lessonId } = req.params;

  if (!['READY', 'RETURN'].includes(action))
    return res.status(400).json({ error: 'bad_action' });

  const newStatus =
    action === 'READY' ? LessonStatus.COMPLETED : LessonStatus.NEED_REWORK;

  // обновляем статус + сохраняем комментарий к FileSubmission
  await prisma.$transaction([
    prisma.lessonProgress.update({
      where: { userId_lessonId: { userId: +userId, lessonId: +lessonId } },
      data: { status: newStatus },
    }),

    comment
      ? prisma.fileSubmission.create({
          data: {
            taskId: null,
            lessonId: +lessonId,
            filePath: '',
            comment,
            teacherId: req.user.id,
          },
        })
      : prisma.fileSubmission.findFirst(), // no‑op
  ]);

  res.json({ ok: true });
});

/* ───────────────────────── CLARIFY ─────────────────────────
   GET /teacher/clarify
   Уроки со статусом NEED_CLARIFY (вопрос от студента)
──────────────────────────────────────────────────────────── */
r.get('/clarify', authMw(['TEACHER']), async (_req, res) => {
  const rows = await prisma.lessonProgress.findMany({
    where: { status: LessonStatus.NEED_CLARIFY },
     select:  selectProgress,
  });
  res.json(json(rows));
});

/* PATCH /teacher/clarify/:userId/:lessonId
   body: { reply:"text" }
   → меняем статус на IN_PROGRESS (или COMPLETED – по логике)
──────────────────────────────────────────────────────────── */
r.patch('/clarify/:userId/:lessonId', authMw(['TEACHER']), async (req, res) => {
  const { reply } = req.body;
  const { userId, lessonId } = req.params;

  await prisma.lessonProgress.update({
    where: { userId_lessonId: { userId: +userId, lessonId: +lessonId } },
    data: {
      status: LessonStatus.IN_PROGRESS,
      meta: { reply },
    },
  });

  res.json({ ok: true });
});

export default r;
