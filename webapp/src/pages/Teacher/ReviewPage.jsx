import { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';

export default function ReviewPage() {
  const { review, approve, requestRedo } = useTeacher();
  const [item, setItem] = useState(null);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

  const rows = review.map((r) => [
    r.course,
    r.lesson,
    r.user,
    <Button key={r.id} variant="secondary" style={{ padding: '4px 10px' }} onClick={() => setItem(r)}>
      Открыть
    </Button>,
  ]);

  return (
    <>
      <Table head={['Курс', 'Урок', 'ФИО', '']} rows={rows} />

      <Modal
        open={!!item}
        onClose={() => { setItem(null); setComment(''); setFile(null); }}
      >
        {item && (
          <>
            <h3>{item.lesson}</h3>
            <p>Файл студента: <a href="#">{item.file}</a></p>

            {/* добавочный файл при возврате */}
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ margin: '12px 0' }}
            />

            <textarea
              rows="3"
              placeholder="Комментарий при возврате"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%' }}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Button
                variant="success"
                onClick={() => { approve(item.id); setItem(null); }}
              >
                Готово
              </Button>

              <Button
                onClick={() => {
                  if (!comment.trim()) { alert('Введите комментарий'); return; }
                  requestRedo(item.id, comment);
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
