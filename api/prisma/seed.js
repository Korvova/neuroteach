import { PrismaClient, Role, LessonCheckType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  /* ───────── 1. admin‑user (CREATOR) ───────── */
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      password: await bcrypt.hash('secret', 10),
      firstName: 'Admin',
      lastName: 'Root',
      role: Role.CREATOR,
    },
  });



/* ---- teacher user ---- */
const teacher = await prisma.user.upsert({
  where: { email: 'teacher@mail.com' },
  update: {},
  create: {
    email: 'teacher@mail.com',
    password: await bcrypt.hash('secret', 10),
    firstName: 'Teacher',
    lastName: 'One',
    role: Role.TEACHER,
  },
});




await prisma.user.upsert({
  where: { email: 'moder@mail.com' },
  update: {},
  create: {
    email: 'moder@mail.com',
    password: await bcrypt.hash('secret', 10),
    firstName: 'Moder',
    lastName: 'One',
    role: Role.MODERATOR,
  },
});








  /* ───────── 2. курсы (upsert by title) ───────── */
  const coursesData = [
    'Вход в нейросети',
    'Маркетинг и нейросети',
    'Микросервисная архитектура',
    'Телеграм‑боты и Web App',
  ];

  const courses = {};
  for (const title of coursesData) {
    const course = await prisma.course.upsert({
      where: { title },
      update: {},
      create: {
        title,
        description: { blocks: [{ text: `Описание курса «${title}»` }] },
        price: 0,
      },
    });
    courses[title] = course;
  }

  /* ───────── 3. тест + вопрос/ответы ───────── */
/* ───────── 3. тест + вопрос/ответы ───────── */
let demoTest = await prisma.test.findFirst({ where: { title: 'Demo Test' } });

if (!demoTest) {
  demoTest = await prisma.test.create({
    data: {
      title: 'Demo Test',
      questions: {
        create: {
          text: '2 + 2 = ?',
          type: 'one',
          answers: {
            create: [
              { text: '4', correct: true },
              { text: '5', correct: false },
            ],
          },
        },
      },
    },
    include: { questions: { include: { answers: true } } },
  });
}


  /* ───────── 4. уроки первого курса ───────── */
  const course1Id = courses['Вход в нейросети'].id;

  // helper to avoid duplicates by (courseId, order)
  async function upsertLesson(order, data) {
    await prisma.lesson.upsert({
      where: { courseId_order: { courseId: course1Id, order } },
      update: {},
      create: { courseId: course1Id, order, ...data },
    });
  }

  await upsertLesson(1, {
    title: 'Введение (просмотр)',
    checkType: LessonCheckType.VIEW,
    content: { blocks: [{ text: 'Контент урока 1' }] },
  });

  await upsertLesson(2, {
    title: 'Введение (файл)',
    checkType: LessonCheckType.FILE,
    content: { blocks: [{ text: 'Задание: выполните и загрузите PDF' }] },
  });

  await upsertLesson(3, {
    title: 'Введение (тест)',
    checkType: LessonCheckType.TEST,
    testId: demoTest.id,
    content: { blocks: [{ text: 'Ответьте на вопросы.' }] },
  });

  console.log('✅  Seed completed');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
