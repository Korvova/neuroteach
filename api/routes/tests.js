import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { json } from '../utils/jsonBigInt.js';
import { authMw } from './_auth.js';

const r = Router();

/* получить тест + вопросы/ответы */
r.get('/:id', async (req, res) => {
  const t = await prisma.test.findUnique({
    where: { id: +req.params.id },
    include: { questions: { include: { answers: true } } },
  });
  t ? res.json(json(t)) : res.status(404).end();
});

/* создать тест (CREATOR) */
r.post('/', authMw(['CREATOR']), async (req, res) => {
  // body: { title, questions:[{text,type,answers:[{text,correct}]}] }
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
  res.json(json(test));
});

export default r;
