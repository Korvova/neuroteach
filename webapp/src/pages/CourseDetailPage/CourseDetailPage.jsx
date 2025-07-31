import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse }   from '../../Services/courses';
import LessonItem      from '../../components/LessonItem/LessonItem';
import Modal           from '../../components/Modal/Modal';
import styles          from './CourseDetailPage.module.css';

export default function CourseDetailPage() {
  const { courseId }   = useParams();
  const  navigate      = useNavigate();

  const [course, setCourse]     = useState(null);
  const [locked, setLocked]     = useState(false);





  /* ── загрузка курса ─────────────────────────────── */
  useEffect(() => { getCourse(courseId).then(setCourse); }, [courseId]);

  if (!course) return null;

  /* ── рассчитываем “открытость” уроков + короткий statusCode ─────── */
const lessons = course.lessons.map((l, i, arr) => {
  const statusCode = l.progress?.status        // новая версия бэка
                  ?? l.progresses?.[0]?.status // старая (если осталась)
                  ?? 'NOT_STARTED';



  const allowed = ['COMPLETED','ON_REVIEW','NEED_CLARIFY'];
  const unlocked = i === 0

  || allowed.includes(arr[i-1].progress?.status)
  || allowed.includes(arr[i-1].progresses?.[0]?.status);

  return { ...l, statusCode, unlocked };
});

  /* сколько уже пройдено */
  const completedCnt = lessons.filter((l) => l.statusCode === 'COMPLETED').length;

  /* клик по уроку */
  const openLesson = (l) =>
    l.unlocked
      ? navigate(`/courses/${courseId}/lesson/${l.id}`)
      : setLocked(true);

  /* ── UI ─────────────────────────────────────────── */
  console.log('⚙️ lessons from API', lessons);      // ← проверьте, что статус прилетает

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{course.title}</h2>

      <p className={styles.progress}>
        Пройдено {completedCnt} из {lessons.length}
      </p>

      <p className={styles.desc}>
        {course.description?.blocks?.[0]?.text ?? 'Описание курса…'}
      </p>

      <h3 className={styles.subtitle}>Уроки</h3>

      <ul className={styles.list}>
        {lessons.map((l) => (
    <LessonItem
  key={l.id}
  order={l.order}
  title={l.title}
  unlocked={l.unlocked}
  statusCode={l.statusCode}
  onClick={() => openLesson(l)}
/>
        ))}
      </ul>

      {/* модалка «урок заблокирован» */}
      <Modal open={locked} onClose={() => setLocked(false)}>
        <p>Урок станет доступен после прохождения предыдущего.</p>
      </Modal>
    </div>
  );
}
