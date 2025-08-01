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



// PUT /api/courses/:id — обновить курс по ID
r.put('/:id', authMw(['CREATOR']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, price } = req.body;
    const course = await prisma.course.update({
      where: { id },
      data: { title, description, price: price || null }
    });
    res.json(course);
  } catch (e) {
    console.error(e);
    if (e.code === 'P2025') { // Prisma error: record not found
      return res.status(404).json({ error: 'course_not_found' });
    }
    res.status(500).json({ error: 'course_update_failed' });
  }
});

// DELETE /api/courses/:id — удалить курс по ID
r.delete('/:id', authMw(['CREATOR']), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.course.delete({ where: { id } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'course_delete_failed' });
  }
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








// POST /api/courses — создать новый курс
r.post('/', authMw(['CREATOR']), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const course = await prisma.course.create({
      data: { title, description, price: price || null }
    });
    res.status(201).json(course);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'course_create_failed' });
  }
});




// DELETE /api/courses/:id — удалить курс по ID
r.delete('/:id', authMw(['CREATOR']), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.course.delete({ where: { id } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'course_delete_failed' });
  }
});




export default r;