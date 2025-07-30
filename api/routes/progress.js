import { Router } from 'express';
import { authMw } from './_auth.js';

import { prisma }       from '../prisma/client.js';
import { LessonStatus } from '@prisma/client';

const r = Router();

/*  POST /progress
    body: { lessonId, score, total }
*/
r.post('/', authMw(), async (req, res) => {
  try {
    const { lessonId, score, total } = req.body;
    const passed = score === total;

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: req.user.id, lessonId } },
      update: {
        status: passed ? LessonStatus.COMPLETED : LessonStatus.IN_PROGRESS,
        meta:   { score, total },
      },
      create: {
        status: passed ? LessonStatus.COMPLETED : LessonStatus.IN_PROGRESS,
        meta:   { score, total },
        user:   { connect: { id: req.user.id } },
        lesson: { connect: { id: lessonId } },
      },
    });

    res.json({ ok: true, passed });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'progress_save_failed' });
  }
});

export default r;
