// src/pages/Creator/TestsPage.jsx
import { useState, useEffect } from 'react';
import { useCreator }    from '../../context/CreatorContext';
import { getTests, deleteTest as deleteTestAPI } from '../../Services/tests';
import Table            from '../../components/Table/Table';
import Button           from '../../components/Button/Button';
import { useNavigate }  from 'react-router-dom';

export default function TestsPage() {
  const { tests, lessons, courses, addTest, deleteTest } = useCreator();
  const nav = useNavigate();

  // Загрузим тесты при монтировании
  useEffect(() => {
    getTests().then(list => list.forEach(t => addTest(t)));
  }, [addTest]);

  const rows = tests.map((t) => {
    // Найдём первый урок, у которого testId === t.id
    const lesson = lessons.find((l) => l.testId === t.id);
    // И его курс
    const course = lesson && courses.find((c) => c.id === lesson.courseId);

    return [
      t.id,
      t.title,
      // номер урока
      lesson ? lesson.order : '—',
      // название курса
      course ? course.title : '—',
      // кол-во вопросов
      t.questions.length,
      <>
        <Button
          variant="secondary"
          onClick={() => nav(`/creator/tests/${t.id}`)}
        >
          Редактировать
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            if (!confirm('Удалить тест?')) return;
            try {
              await deleteTestAPI(t.id);
              deleteTest(t.id);
            } catch {
              alert('Не удалось удалить тест');
            }
          }}
        >
          Удалить
        </Button>
      </>
    ];
  });

  return (
    <>
      <Button
        onClick={() => nav('/creator/tests/new')}
        style={{ marginBottom: 12 }}
      >
        Создать тест
      </Button>
      <Table
        head={['ID', 'Название', 'Урок №', 'Курс', 'Вопросов', '']}
        rows={rows}
      />
    </>
  );
}
