import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StatusTag from '../../components/StatusTag/StatusTag';
import styles from './TaskDetailPage.module.css';

/* мок‑данные */
const tasks = {
  t1: {
    title: 'Подготовить презентацию по Midjourney',
    description: `
      Сгенерируйте 10 примеров изображений по теме «брендинг кофейни».
      Подготовьте презентацию (PDF, 8–12 слайдов) с пояснениями промптов.
    `,
    status: { code: 'pending', label: 'Ждёт выполнения' },
    type: 'file',
  },
  t2: {
    title: 'Сдать PDF‑отчёт «Промптинг»',
    description: 'Загрузите финальный отчёт в PDF до 31 июля.',
    status: { code: 'review', label: 'На проверке' },
    type: 'file',
  },
  t3: {
    title: 'Исправить замечания по ДЗ №1',
    description: 'Внесите правки, перечисленные в комментариях преподавателя.',
    status: { code: 'redo', label: 'Возврат на доработку' },
    type: 'file',
  },
};

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = tasks[taskId];

  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');

  const sendFile = () => {
    alert('Файл отправлен!');
    navigate('/profile/tasks');
  };

  const sendQuestion = () => {
    alert('Вопрос отправлен!');
    setQuestion('');
  };

  if (!task) return <p>Task not found</p>;

  return (
    <div className={styles.wrap}>
      <button onClick={() => navigate(-1)} className={styles.back}>← Назад</button>

      <h2>{task.title}</h2>
      <StatusTag {...task.status} />
      <p className={styles.desc}>{task.description}</p>

      <h3 className={styles.h}>Задать уточняющий вопрос</h3>
      <textarea
        rows="4"
        placeholder="Ваш вопрос…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className={styles.ta}
      />
      <button
        className={styles.primary}
        disabled={!question.trim()}
        onClick={sendQuestion}
      >
        Отправить вопрос
      </button>

      <h3 className={styles.h}>Закрыть задачу</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className={styles.primary}
        disabled={!file}
        onClick={sendFile}
      >
        Прикрепить файл и отправить
      </button>
    </div>
  );
}
