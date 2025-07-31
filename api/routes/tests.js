// routes/tests.js
import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { json } from '../utils/jsonBigInt.js';
import { authMw } from './_auth.js';

const r = Router();

// GET /api/tests — список всех тестов (только для создателя)
r.get('/', authMw(['CREATOR']), async (req, res) => {
  const tests = await prisma.test.findMany({
    include: {
      questions: { include: { answers: true } }
    }
  });
  res.json(json(tests));
});

// GET /api/tests/:id — единичный тест
r.get('/:id', authMw(['CREATOR']), async (req, res) => {
  const t = await prisma.test.findUnique({
    where: { id: +req.params.id },
    include: { questions: { include: { answers: true } } },
  });
  t ? res.json(json(t)) : res.status(404).end();
});

// POST /api/tests — создать тест
r.post('/', authMw(['CREATOR']), async (req, res) => {
  const data = req.body;
  const test = await prisma.test.create({
    data: {
      title: data.title,
      questions: {
        create: data.questions.map((q) => ({
          text: q.text,
          type: q.type,
          answers: { create: q.answers },
        })),
      },
    },
    include: { questions: { include: { answers: true } } },
  });
  res.status(201).json(json(test));
});

// PUT /api/tests/:id — обновить тест
r.put('/:id', authMw(['CREATOR']), async (req, res) => {
  const data = req.body;
  // Для простоты: удалим старые вопросы+ответы и создадим новые
  await prisma.question.deleteMany({ where: { testId: +req.params.id } });
  const test = await prisma.test.update({
    where: { id: +req.params.id },
    data: {
      title: data.title,
      questions: {
        create: data.questions.map((q) => ({
          text: q.text,
          type: q.type,
          answers: { create: q.answers },
        })),
      },
    },
    include: { questions: { include: { answers: true } } },
  });
  res.json(json(test));
});




// routes/tests.js
/* DELETE /api/tests/:id — отвязать от уроков, удалить вопросы/ответы и сам тест */
r.delete('/:id', authMw(['CREATOR']), async (req, res) => {
  const id = +req.params.id;

  try {
    // 1) отвязываем тест от всех уроков
    await prisma.lesson.updateMany({
      where:  { testId: id },
      data:   { checkType: 'VIEW', testId: null },
    });

    // 2) удаляем все ответы и вопросы
    await prisma.answer.deleteMany({
      where: { question: { testId: id } },
    });
    await prisma.question.deleteMany({
      where: { testId: id },
    });

    // 3) удаляем сам тест
    await prisma.test.delete({ where: { id } });

    // если дошли до сюда — успешно
    return res.status(204).end();

  } catch (err) {
    // Если тест уже был удалён — вернём 404, иначе 500
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'not_found' });
    }
    console.error('test.delete failed:', err);
    return res.status(500).json({ error: 'test_delete_failed' });
  }
});







export default r;
