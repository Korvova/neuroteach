import { useNavigate } from 'react-router-dom';
import { useCreator } from '../../context/CreatorContext';
import { useEffect } from 'react';
import { getCourses } from '../../Services/courses';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';

import { getLessons, deleteLesson as deleteLessonAPI } from '../../Services/lessons';


export default function CreatorLessonsPage() {
  const { lessons, courses, addLesson, addCourse, deleteLesson } = useCreator();
  const nav = useNavigate();

  // при заходе на страницу — загрузить уроки и курсы из API
  useEffect(() => {


   if (lessons.length === 0) {
     getLessons().then((list) => list.forEach((l) => addLesson(l)));
   }




    getCourses().then((cs) => cs.forEach((c) => addCourse(c)));


  }, []);

 const rows = lessons.map((l) => [
    l.id,
    l.title,
    courses.find((c) => c.id === l.courseId)?.title || '—',
    l.checkType,
    <>
      <Button
        variant="secondary"
        onClick={() => nav(`/creator/lessons/${l.id}`)}
      >
        Редактировать
      </Button>
      <Button
        variant="danger"
        onClick={async () => {
          if (!confirm('Удалить урок?')) return;
          try {
            await deleteLessonAPI(l.id);
            deleteLesson(l.id);  // убираем из контекста
          } catch {
            alert('Не удалось удалить урок');
          }
        }}
      >
        Удалить
      </Button>
    </>
  ]);

  return (
    <>
      <Button
        onClick={() => nav('/creator/lessons/new')}
        style={{ marginBottom: 12 }}
      >
         Создать урок
      </Button>

      <Table
        head={['ID', 'Название', 'Курс', 'Проверка', '']}
        rows={rows}
      />
    </>
  );
}
