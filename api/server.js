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
import lessonCommentsRoutes from './routes/lessonComments.js';



const app = express();
app.use(cors());



app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const _json = res.json.bind(res);
  res.json = (data) => _json(jsonFix(data));  // BigInt → Number во всём API
  next();
});


app.use(morgan('dev'));

 // Логируем все POST без wildcard‑роутинга:
 app.use((req, res, next) => {
   if (req.method === 'POST') {
     console.log('📩 POST на', req.path, 'с телом', req.body);
   }
   next();
 });




const API = '/api';

app.use(`${API}/auth`,       authRoutes);
app.use(`${API}/courses`,    courseRoutes);
app.use(`${API}/lessons`,    lessonRoutes);
app.use(`${API}/tests`,      testRoutes);
app.use(`${API}/upload`,     uploadRoutes);
app.use(`${API}/teacher`,    teacherRoutes);
app.use(`${API}/participants`, participantsRoutes);
app.use(`${API}/groups`,       groupsRoutes);
app.use(`${API}/payments`,     paymentsRoutes);


app.use(`${API}/lessonComments`, lessonCommentsRoutes);



/* static access for uploaded files */
app.use(`${API}/uploads`, express.static('uploads'));

app.listen(4000, () => console.log('API listening on :4000'));
