import { useEffect, useState } from 'react';
import { getLessonComments, sendLessonComment } from '../../Services/progress';
import Button from '../Button/Button';
import styles from './LessonComments.module.css';

export default function LessonComments({ lessonId, onStatusChange }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    load();
  }, [lessonId]);

  async function load() {
    try {
      const data = await getLessonComments(lessonId);
      setComments(data);
    } catch (e) {
      console.error('Error loading comments:', e);
    }
  }

  async function handleSend() {
    if (!text.trim()) return;
    setSending(true);
    try {
      const updated = await sendLessonComment(lessonId, text.trim());
      setComments(updated);
      setText('');
      onStatusChange('NEED_CLARIFY');
    } catch (e) {
      alert('Не удалось отправить комментарий');
      console.error('Error sending comment:', e);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.container}>
      <h3>Вопросы и ответы</h3>
      <ul className={styles.list}>


{comments.map(c => (
  <li key={c.id} className={styles.item}>
    <b>{c.author.firstName} {c.author.lastName}</b>
    <span className={styles.date}>
      {new Date(c.createdAt).toLocaleString()}
    </span>
    <p>{c.text}</p>

    {c.answer && c.teacher && (
      <div className={styles.answer}>
        <b>
          {c.teacher.firstName} {c.teacher.lastName} (Преподаватель)
        </b>
        <span className={styles.date}>
          {new Date(c.createdAt).toLocaleString()}
        </span>
        <p>{c.answer}</p>
      </div>
    )}
  </li>
))}

      </ul>



      <div className={styles.form}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Задайте уточняющий вопрос"
        />
        <Button
          onClick={handleSend}
          disabled={sending || !text.trim()}
        >
          {sending ? 'Отправляем…' : 'Отправить вопрос'}
        </Button>
      </div>
    </div>
  );
}