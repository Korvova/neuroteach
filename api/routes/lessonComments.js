import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { LessonStatus } from '@prisma/client';
import { json } from '../utils/jsonBigInt.js';

const r = Router();

// GET /lessonComments/:lessonId — получить все комментарии к уроку
r.get('/:lessonId', authMw(), async (req, res) => {
  try {
    const lessonId = +req.params.lessonId;
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ error: 'lesson_not_found' });
    }

    const comments = await prisma.lessonComment.findMany({
      where: { lessonId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(json(comments));
  } catch (e) {
    console.error('Error in GET /lessonComments/:lessonId:', e);
    res.status(500).json({ error: 'fetch_comments_failed' });
  }
});

// POST /lessonComments/:lessonId — добавить комментарий и поставить статус NEED_CLARIFY
r.post('/:lessonId', authMw(['STUDENT']), async (req, res) => {
  const lessonId = +req.params.lessonId;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'invalid_text' });
  }

  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ error: 'lesson_not_found' });
    }

    const comment = await prisma.lessonComment.create({
      data: { lessonId, authorId: userId, text: text.trim() },
    });

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: LessonStatus.NEED_CLARIFY,
        meta: { question: text.trim(), commentId: comment.id.toString() },
      },
      create: {
        userId,
        lessonId,
        status: LessonStatus.NEED_CLARIFY,
        meta: { question: text.trim(), commentId: comment.id.toString() },
      },
    });

    const comments = await prisma.lessonComment.findMany({
      where: { lessonId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(201).json(json(comments));
  } catch (e) {
    console.error('Error in POST /lessonComments/:lessonId:', e);
    res.status(500).json({ error: 'comment_failed' });
  }
});

// POST /lessonComments/:commentId/answer — ответить на комментарий (TEACHER)
r.post('/:commentId/answer', authMw(['TEACHER']), async (req, res) => {
  const commentId = +req.params.commentId;
  const { answer } = req.body;
  const teacherId = req.user.id;

  if (!answer || typeof answer !== 'string' || !answer.trim()) {
    return res.status(400).json({ error: 'invalid_answer' });
  }

  try {
    const comment = await prisma.lessonComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return res.status(404).json({ error: 'comment_not_found' });
    }

    await prisma.lessonComment.update({
      where: { id: commentId },
      data: { answer: answer.trim(), teacherId },
    });

    const comments = await prisma.lessonComment.findMany({
      where: { lessonId: comment.lessonId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(json(comments));
  } catch (e) {
    console.error('Error in POST /lessonComments/:commentId/answer:', e);
    res.status(500).json({ error: 'answer_failed' });
  }
});

export default r;