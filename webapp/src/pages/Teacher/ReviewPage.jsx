// src/pages/Teacher/ReviewPage.jsx
import { useState, useEffect } from 'react';
import { useTeacher }            from '../../context/TeacherContext';
import { getSubmission }         from '../../Services/teacher';
import Table                     from '../../components/Table/Table';
import Modal                     from '../../components/Modal/Modal';
import Button                    from '../../components/Button/Button';

export default function ReviewPage() {
  const { review, approve, requestRedo } = useTeacher();
  const [item, setItem]       = useState(null);
  const [comment, setComment] = useState('');
  const [submission, setSubmission] = useState(null);

  // при открытии модалки — подгружаем файл
  useEffect(() => {
    if (!item) return setSubmission(null);
    getSubmission(item.user.id, item.lesson.id)
      .then(setSubmission)
      .catch(console.error);
  }, [item]);

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

 {submission?.filePath ? (
   <p>
     Файл студента:{' '}
     <a
       href={submission.filePath.startsWith('/') 
         ? submission.filePath 
         : '/' + submission.filePath}
       target="_blank"
       rel="noopener noreferrer"
       download
     >
       Скачать
     </a>
   </p>
 ) : (
   <p>— нет прикрепленных файлов —</p>
 )}

            <textarea
              rows="3"
              placeholder="Комментарий при возврате"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', margin: '12px 0' }}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Button
                variant="success"
                onClick={async () => {
                  await approve(item.user.id, item.lesson.id);
                  setItem(null);
                }}
              >
                Готово
              </Button>

              <Button
                variant="secondary"
                onClick={async () => {
                  if (!comment.trim()) {
                    alert('Введите комментарий');
                    return;
                  }
                  await requestRedo(
                    item.user.id,
                    item.lesson.id,
                    comment
                  );
                  setItem(null);
                }}
              >
                Вернуть на доработку
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
