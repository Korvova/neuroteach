import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonItem from '../../components/LessonItem/LessonItem';
import Modal from '../../components/Modal/Modal';
import styles from './CourseDetailPage.module.css';

/* мок‑данные (позже придут из API) */
const courses = {
  intro: {
    title: 'Вход в нейросети',
    description: `
      Курс знакомит с базовыми принципами работы нейросетей,
      языковыми моделями и практическим применением ChatGPT.
      Подойдёт новичкам без предыдущего опыта.
    `,
    lessons: [
      { id: 'view', title: 'Введение (просмотр)', unlocked: true },
      { id: 'file', title: 'Введение (файл)',       unlocked: true },
      { id: 'test', title: 'Введение (тест)',       unlocked: true },
      { id: 'demo', title: 'Демонстрация и практическое знакомство с ChatGPT', unlocked: false },
      { id: 'prompt', title: 'Промптинг. Мастер‑класс', unlocked: false },
      { id: 'advanced', title: 'Расширенные возможности ChatGPT и GPT‑помощники', unlocked: false },
      /* ... остальные из ТЗ ... */
    ],
  },
  /* другие курсы добавим позже */
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const course = courses[courseId] || { title: 'Курс', lessons: [] };

  const handleLessonClick = (lesson) => {
    if (!lesson.unlocked) {
      setModalOpen(true);
    } else {
      navigate(`/courses/${courseId}/lesson/${lesson.id}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{course.title}</h2>

      <p className={styles.desc}>{course.description}</p>

      <h3 className={styles.subtitle}>Уроки</h3>

      <ul className={styles.list}>
        {course.lessons.map((l) => (
          <LessonItem
            key={l.id}
            title={l.title}
            unlocked={l.unlocked}
            onClick={() => handleLessonClick(l)}
          />
        ))}
      </ul>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <p>Урок станет доступен после прохождения предыдущего.</p>
      </Modal>
    </div>
  );
}
