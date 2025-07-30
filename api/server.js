import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes       from './routes/auth.js';
import courseRoutes     from './routes/courses.js';
import lessonRoutes     from './routes/lessons.js';
import testRoutes       from './routes/tests.js';
import uploadRoutes     from './routes/upload.js';

import { json as jsonFix } from './utils/jsonBigInt.js';
import teacherRoutes from './routes/teacher.js';

import progress from './routes/progress.js';

import participantsRoutes from './routes/participants.js';
import groupsRoutes       from './routes/groups.js';
import paymentsRoutes     from './routes/payments.js';
import progressRoutes from './routes/lessonProgress.js';




const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const _json = res.json.bind(res);
  res.json = (data) => _json(jsonFix(data));  // BigInt → Number во всём API
  next();
});


app.use(morgan('dev'));

app.use('/auth',   authRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/tests',   testRoutes);
app.use('/upload',  uploadRoutes);   // local → /uploads

app.use('/teacher', teacherRoutes);

app.use('/progress', progress);

app.use('/participants', participantsRoutes);   // все под /participants
app.use('/groups',       groupsRoutes);
app.use('/payments',     paymentsRoutes);
app.use('/lesson-progress', progressRoutes);




/* static access for uploaded files */
app.use('/uploads', express.static('uploads'));

app.listen(4000, () => console.log('API listening on :4000'));
