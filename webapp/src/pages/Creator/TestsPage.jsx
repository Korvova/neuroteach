import { useState, useEffect } from 'react';
import { useCreator }    from '../../context/CreatorContext';
import { getTests, deleteTest as deleteTestAPI } from '../../Services/tests';
import Table            from '../../components/Table/Table';
import Button           from '../../components/Button/Button';
import { useNavigate }  from 'react-router-dom';

export default function TestsPage() {
  const { tests, addTest, deleteTest } = useCreator();
  const nav = useNavigate();

  useEffect(() => {
    getTests().then((list) => list.forEach((t) => addTest(t)));
  }, []);

  const rows = tests.map((t) => [
    t.id,
    t.title,
    t.questions.length,
    <>
      <Button variant="secondary" onClick={() => nav(`/creator/tests/${t.id}`)}>
        Редактировать
      </Button>


<Button
  variant="danger"
  onClick={async () => {
    if (!confirm('Удалить тест?')) return;
    try {
      await deleteTestAPI(t.id);
      deleteTest(t.id); // из контекста
    } catch (e) {
      alert('Не удалось удалить тест');
    }
  }}
>
  Удалить
</Button>



    </>
  ]);

  return (
    <>
      <Button onClick={() => nav('/creator/tests/new')} style={{ marginBottom: 12 }}>
        Создать тест
      </Button>
      <Table head={['ID', 'Название', 'Вопросов', '']} rows={rows} />
    </>
  );
}
