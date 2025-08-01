// src/pages/Teacher/ClarifyPage.jsx
import { useState, useEffect } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';

export default function ClarifyPage() {
  const { clarify, answerQ } = useTeacher();
  const [item, setItem] = useState(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    console.log('🔥 ClarifyPage: clarify payload =', clarify);
  }, [clarify]);

  const rows = Array.isArray(clarify)
    ? clarify.map((c) => [
        c.lesson.course.title,
        c.lesson.title,
        `${c.user.firstName} ${c.user.lastName}`,
        c.meta?.question || '—',
        <Button
          key={`${c.user.id}-${c.lesson.id}`}
          variant="secondary"
          onClick={() => setItem(c)}
        >
          Открыть
        </Button>,
      ])
    : [];

  return (
    <>
      <Table head={['Курс','Урок','Студент','Вопрос','']} rows={rows} />

      <Modal
        open={!!item}
        onClose={() => {
          setItem(null);
          setAnswer('');
        }}
      >
        {item && (
          <>
            <h3>{item.lesson.title}</h3>
            {/* ... остальной код */}
          </>
        )}
      </Modal>
    </>
  );
}
