import { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';

export default function ClarifyPage() {
  const { clarify, answerQ } = useTeacher();
  const [item, setItem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [attach, setAttach] = useState(null);

  const rows = clarify.map((c) => [
    c.id,
    c.course,
    c.lesson,
    c.user,
    c.status,
    <Button key={c.id} variant="secondary" style={{ padding: '4px 10px' }} onClick={() => setItem(c)}>
      Открыть
    </Button>,
  ]);

  return (
    <>
      <Table head={['ID', 'Курс', 'Урок', 'ФИО', 'Статус', '']} rows={rows} />

      <Modal
        open={!!item}
        onClose={() => { setItem(null); setAnswer(''); setAttach(null); }}
      >
        {item && (
          <>
            <h3>{item.lesson}</h3>

            {/* история переписки */}
            <div style={{ background:'#f5f5f5', padding:12, borderRadius:8, maxHeight:150, overflow:'auto' }}>
              <p><strong>Вопрос:</strong> {item.q}</p>
              {item.a && <p><strong>Ответ:</strong> {item.a}</p>}
            </div>

            <textarea
              rows="4"
              placeholder="Ваш ответ…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ width: '100%', marginTop: 12 }}
            />

            <input
              type="file"
              onChange={(e) => setAttach(e.target.files[0])}
              style={{ margin: '12px 0' }}
            />

            <Button
              variant="success"
              onClick={() => {
                if (!answer.trim()) { alert('Введите ответ'); return; }
                answerQ(item.id, answer);
                if (attach) alert('Файл приложен: ' + attach.name);
                setItem(null);
              }}
            >
              Отправить ответ
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
