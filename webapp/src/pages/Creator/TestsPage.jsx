import { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

export default function TestsPage() {
  const { tests } = useCreator();
  const nav = useNavigate();

  const rows = tests.map((t) => [
    t.id,
    t.title,
    t.lessonId ?? '—',
    t.questions.length,
    <Button key={t.id} variant="secondary"
      onClick={()=>nav(`/creator/tests/${t.id}`)}>Редактировать
    </Button>,
  ]);

  return (
    <>
      <Button onClick={()=>nav('/creator/tests/new')}>Создать тест</Button>
      <Table head={['ID','Название','Урок','Вопросов','']} rows={rows}/>
    </>
  );
}
