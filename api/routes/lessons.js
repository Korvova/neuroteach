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
  const lesson = await prisma.lesson.findUnique({
    where: { id: +req.params.id },
    include: {
      test: {
        include: { questions:{ include:{ answers:true } } }
      },
      progresses: {
        where: { userId: req.user.id },
        select: { status:true, meta:true }
      },
     submissions: {
       where: { teacherId: { not: null } },   // только записи преподавателя
       select: {
         id:     true,
         filePath: true,
         comment:  true,
         createdAt:true,
         teacher: { select: { firstName:true, lastName:true } }
      }
    }
    }
  });
  lesson
    ? res.json({ ...lesson, progress: lesson.progresses[0] ?? null })
    : res.status(404).end();
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




// POST /api/lessons — создать новый урок (CREATOR)
r.post('/', authMw(['CREATOR']), async (req, res) => {
  console.log('🔍 createLesson body:', req.body);
  const { courseId, title, order, content, checkType, testId } = req.body;
  try {
    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        order,
        content,
        checkType,
        ...(checkType === 'TEST' && testId ? { testId } : {})
      }
    });
    return res.status(201).json(lesson);
  } catch (e) {
    console.error('❌ createLesson error:', e);
    if (e.code === 'P2002' && e.meta?.target?.includes('courseId') && e.meta.target.includes('order')) {
      // нашли конфликт по courseId+order
      const existing = await prisma.lesson.findFirst({
        where: { courseId, order }
      });
      return res.status(409).json({
        error: 'duplicate_order',
        existingId: existing.id
      });
    }
    return res.status(500).json({ error: 'lesson_create_failed' });
  }
});





/** DELETE /api/lessons/:id — удалить урок и всё, что к нему привязано */
r.delete('/:id', authMw(['CREATOR']), async (req, res) => {
  const id = +req.params.id;
  try {
    // 1) Удаляем все комментарии к уроку
    await prisma.lessonComment.deleteMany({
      where: { lessonId: id }
    });

    // 2) Удаляем все сабмишны файлов (и ответы преподавателя)
    await prisma.fileSubmission.deleteMany({
      where: { lessonId: id }
    });

    // 3) Удаляем записи прогресса
    await prisma.lessonProgress.deleteMany({
      where: { lessonId: id }
    });

    // 4) Тут, если нужно — отвязать тест от урока,
    //    но обычно тесты мы не трогаем при удалении урока.

    // 5) Удаляем сам урок
    await prisma.lesson.delete({ where: { id } });

    return res.status(204).end();
  } catch (err) {
    console.error('lesson.delete failed:', err);
    if (err.code === 'P2025') {
      // не найден — вернём 404
      return res.status(404).json({ error: 'not_found' });
    }
    return res.status(500).json({ error: 'lesson_delete_failed' });
  }
});








// GET /api/lessons — вернуть все уроки (CREATOR)
r.get('/', authMw(['CREATOR']), async (req, res) => {

  const list = await prisma.lesson.findMany({
    orderBy: [
      { courseId: 'asc' },
      { order:    'asc' },
    ]
  });
  res.json(list);
});



export default r;

