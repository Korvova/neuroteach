import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { json } from '../utils/jsonBigInt.js';

const r = Router();

/* ────────────────────────────────────────────────
   GET /lessons/:id
   Возвращает урок + (при наличии) связанный тест
────────────────────────────────────────────────── */
r.get('/:id', authMw(), async (req, res) => {
  const id = +req.params.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      test: {
        include: {
          questions: {
            include: { answers: true },
          },
        },
      },
    },
  });

  lesson ? res.json(json(lesson)) : res.status(404).end();
});

/* ────────────────────────────────────────────────
   POST /lessons
   Создать новый урок            (если body.id отсутствует)
   или обновить существующий     (если body.id передан)
   Роль: CREATOR
────────────────────────────────────────────────── */
r.post('/', authMw(['CREATOR']), async (req, res) => {
  const data = req.body;                       // courseId, order, title, ...

  // конвертируем BigInt‑поля в number
  if (data.id)       data.id       = +data.id;
  if (data.courseId) data.courseId = +data.courseId;
  if (data.testId)   data.testId   = +data.testId;

  const lesson = data.id
    ? await prisma.lesson.update({ where: { id: data.id }, data })
    : await prisma.lesson.create({ data });

  res.json(json(lesson));
});

/* ────────────────────────────────────────────────
   PUT /lessons/:id
   Частичное обновление урока
   Роль: CREATOR
────────────────────────────────────────────────── */
r.put('/:id', authMw(['CREATOR']), async (req, res) => {
  const id = +req.params.id;
  const data = req.body;                       // поля для апдейта

  if (data.courseId) data.courseId = +data.courseId;
  if (data.testId)   data.testId   = +data.testId;

  try {
    const lesson = await prisma.lesson.update({ where: { id }, data });
    res.json(json(lesson));
  } catch {
    res.status(404).end();
  }
});

export default r;

