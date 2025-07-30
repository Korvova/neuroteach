import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { json } from '../utils/jsonBigInt.js'; 
const r = Router();

/* публичный список */
r.get('/', async (_req, res) => {
  const data = await prisma.course.findMany({
    select: { id: true, title: true, price: true },
  });
  res.json(data);
});




/* детально + уроки + прогресс текущего пользователя */
r.get('/:id', authMw(), async (req, res) => {
  const id      = +req.params.id;
  const userId  =  req.user.id;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: {
          progresses: {
            where:  { userId },
            select: { status: true }
          }
        }
      }
    }
  });


  if (!course) return res.status(404).end();                     // ★

  // превращаем progresses[0] → progress:{status}
  course.lessons = course.lessons.map(l => ({
    ...l,
    progress:  l.progresses[0] ?? { status: 'NOT_STARTED' },
  }));

  delete course.lessons.progresses;      // удалить мусор, если нужно

  res.json(json(course));                                        // ★
});  



/* ───────── 3. создать курс (Creator) ───────── */
r.post('/', authMw(['CREATOR']), async (req, res) => {
  const { title, description, price } = req.body;

  const c = await prisma.course.create({
    data: { title, description, price },
  });
  res.json(json(c));
});

export default r;