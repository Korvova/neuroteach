import { Router } from 'express';
import multer from 'multer';

import { authMw } from './_auth.js';


import { prisma }            from '../prisma/client.js';
import { LessonStatus }      from '@prisma/client';   // 👈 enum берём из пакета


const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (_req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});
const upload = multer({ storage });

const r = Router();

/* POST /upload  (form‑data: file, lessonId) → { url } */
r.post('/', authMw(), upload.single('file'), async (req, res) => {
  try {
    const lessonId = Number(req.body.lessonId);
    const fileUrl  = `/uploads/${req.file.filename}`;

    await prisma.$transaction([
      prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: { userId: req.user.id, lessonId },
        },
       

   /* обязательно передаём student и lesson
      (иначе Prisma ругается, что поле не заполнено) */
   update: {
     status : LessonStatus.ON_REVIEW,
     student: { connect: { id: req.user.id } },
     lesson : { connect: { id: lessonId    } },
   },



        create: {
          status: LessonStatus.ON_REVIEW,
          user:   { connect: { id: req.user.id } },
          lesson: { connect: { id: lessonId    } },
        },
      }),
      prisma.fileSubmission.create({
        data: {
          filePath: fileUrl,
          lesson:   { connect: { id: lessonId } },
          student:  { connect: { id: req.user.id } },
        },
      }),
    ]);

    res.json({ ok: true, url: fileUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'upload_failed' });
  }
});

export default r;
