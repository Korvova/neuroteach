import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonItem from '../../components/LessonItem/LessonItem';
import Modal from '../../components/Modal/Modal';
import styles from './CourseDetailPage.module.css';

/* mock‑данные со статусами */
const courses = {
  intro: {
    title: 'Вход в нейросети',
    description:
      'Курс знакомит с базовыми принципами работы нейросетей и ChatGPT. Подойдёт новичкам без предыдущего опыта.',
    lessons: [
      { id: 'view',  title: 'Введение (просмотр)',  unlocked: true,  status: { code: 'done',    label: 'пройден' } },
      { id: 'file',  title: 'Введение (файл)',      unlocked: true,  status: { code: 'review',  label: 'на проверке' } },
      { id: 'test',  title: 'Введение (тест)',      unlocked: true,  status: { code: 'clarify', label: 'на уточнении' } },
      { id: 'demo',  title: 'Демонстрация ChatGPT', unlocked: false },
      { id: 'prompt',title: 'Промптинг. Мастер‑класс', unlocked: false },
      { id: 'adv',   title: 'Расширенные возможности ChatGPT', unlocked: false },
    ],
  },
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const course = courses[courseId] || { title: 'Курс', lessons: [] };

  /* сколько уроков «пройдено» */
  const completed = course.lessons.filter((l) => l.status?.code === 'done').length;

  const openLesson = (l) =>
    l.unlocked ? navigate(`/courses/${courseId}/lesson/${l.id}`) : setModal(true);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{course.title}</h2>

      {/* счётчик прогресса */}
      <p className={styles.progress}>Пройдено {completed} из {course.lessons.length}</p>

      <p className={styles.desc}>{course.description}</p>

      <h3 className={styles.subtitle}>Уроки</h3>

      <ul className={styles.list}>
        {course.lessons.map((l) => (
          <LessonItem
            key={l.id}
            title={l.title}
            unlocked={l.unlocked}
            status={l.status}
            onClick={() => openLesson(l)}
          />
        ))}
      </ul>

      <Modal open={modal} onClose={() => setModal(false)}>
        <p>Урок станет доступен после прохождения предыдущего.</p>
      </Modal>
    </div>
  );
}
