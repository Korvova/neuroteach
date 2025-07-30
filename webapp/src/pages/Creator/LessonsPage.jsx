import { useNavigate } from 'react-router-dom';
import { useCreator } from '../../context/CreatorContext';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';

export default function CreatorLessonsPage() {
  const { lessons, courses } = useCreator();
  const nav = useNavigate();

  const rows = lessons.map((l) => [
    l.id,
    l.title,
    courses.find((c) => c.id === l.courseId)?.title || '—',
    l.checkType,
    <Button
      key={l.id}
      variant="secondary"
      onClick={() => nav(`/creator/lessons/${l.id}`)}
    >
      Редактировать
    </Button>,
  ]);

  return (
    <>
      <Button onClick={() => nav('/creator/lessons/new')} style={{ marginBottom: 12 }}>
        Создать урок
      </Button>

      <Table head={['ID', 'Название', 'Курс', 'Проверка', '']} rows={rows} />
    </>
  );
}
