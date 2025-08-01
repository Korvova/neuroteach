// src/pages/Teacher/ReviewPage.jsx
import { useState, useEffect } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';

export default function ReviewPage() {
  const { review, approve, requestRedo } = useTeacher();
  const [item, setItem]     = useState(null);
  const [comment, setComment] = useState('');

  // Логируем, чтобы понять, что реально лежит в review
  useEffect(() => {
    console.log('🔥 ReviewPage: review payload =', review);
  }, [review]);

  // Гарантируем, что rows = [] если review не массив
  const rows = Array.isArray(review)
    ? review.map((r) => [
        r.lesson.course.title,
        r.lesson.title,
        `${r.user.firstName} ${r.user.lastName}`,
        <Button
          key={`${r.user.id}-${r.lesson.id}`}
          variant="secondary"
          onClick={() => setItem(r)}
        >
          Открыть
        </Button>,
      ])
    : [];

  return (
    <>
      <Table head={['Курс','Урок','Студент','']} rows={rows} />

      <Modal
        open={!!item}
        onClose={() => {
          setItem(null);
          setComment('');
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
