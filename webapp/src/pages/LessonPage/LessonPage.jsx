
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson } from '../../Services/lessons';
import { saveTestResult } from '../../Services/progress';
import { uploadFile } from '../../Services/upload';
import Modal from '../../components/Modal/Modal';
import styles from './LessonPage.module.css';
import draftToHtml from 'draftjs-to-html';
import { convertFromRaw } from 'draft-js';
import { completeLesson } from '../../Services/progress';
import LessonComments from '../../components/LessonComments/LessonComments';

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [file, setFile] = useState(null);
  const [chosen, setChosen] = useState({});
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState(null);
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getLesson(lessonId).then((l) => {
      setLesson(l);
      setStatus(l.progresses?.[0]?.status ?? null);
    });
  }, [lessonId]);

  if (!lesson) return null;

  const handleNext = () => navigate(-1);

  const StatusBadge = () => {
    const map = {
      ON_REVIEW: 'Отправлено — ждёт проверки',
      NEED_CLARIFY: 'Нужны уточнения',
      NEED_REWORK: 'Вернули на доработку',
      COMPLETED: 'Готово',
    };
    if (!status || status === 'NOT_STARTED') return null;
    return (
      <span className={`${styles.badge} ${styles[status]}`}>
        {map[status]}
      </span>
    );
  };

  const renderContent = (content) => {
    const raw = typeof content === 'string' ? JSON.parse(content) : content;
    console.log('renderContent raw:', raw);
    const html = draftToHtml(raw);
    console.log('renderContent html:', html);
    return <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />;
  };

  /* ---------- FILE-урок: загрузка ---------- */
  if (lesson.checkType === 'FILE') {
    return (
      <div className={styles.container}>
        <StatusBadge />
        <h2 className={styles.title}>{lesson.title}</h2>
        {renderContent(lesson.content)}
        <p>Скачайте задание, выполните и прикрепите файл.</p>
        <div className={styles.fileBlock}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            className={styles.primary}
            disabled={!file}
            onClick={async () => {
              try {
                await uploadFile(lesson.id, file);
                setSent(true);
                setStatus('ON_REVIEW');
                setLesson({ ...lesson, progress: { status: 'ON_REVIEW' } });
              } catch {
                alert('Не удалось загрузить файл');
              }
            }}
          >
            {sent ? 'Отправлено ✔' : 'Отправить'}
          </button>
          <LessonComments lessonId={lesson.id} onStatusChange={setStatus} />
        </div>
      </div>
    );
  }

  /* ---------- VIEW-урок ---------- */
  if (lesson.checkType === 'VIEW') {
    return (
      <div className={styles.container}>
        <StatusBadge />
        <h2 className={styles.title}>{lesson.title}</h2>
        {renderContent(lesson.content)}
        <button
          className={styles.primary}
          onClick={async () => {
            await completeLesson(lesson.id);
            setStatus('COMPLETED');
            handleNext();
          }}
        >
          Далее
        </button>
        <LessonComments lessonId={lesson.id} onStatusChange={setStatus} />
      </div>
    );
  }

  /* ---------- TEST-урок ---------- */
  if (lesson.checkType === 'TEST') {
    const q = lesson.test.questions[idx];
    const finishTest = async () => {
      const total = lesson.test.questions.length;
      const score = Object.entries(chosen).reduce((s, [qi, ansIdx]) => {
        const answer = lesson.test.questions[qi].answers[ansIdx];
        return answer.correct ? s + 1 : s;
      }, 0);
      await saveTestResult(lesson.id, score, total);
      setResult({ score, total, passed: score === total });
      if (score === total) setStatus('COMPLETED');
    };

    return (
      <div className={styles.container}>
        <StatusBadge />
        <h2 className={styles.title}>{lesson.title}</h2>
        {renderContent(lesson.content)}
        <p className={styles.counter}>
          {idx + 1}/{lesson.test.questions.length}
        </p>
        <p className={styles.qtext}>{q.text}</p>
        <ul className={styles.answers}>
          {q.answers.map((a, i) => (
            <li key={i}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="ans"
                  checked={chosen[idx] === i}
                  onChange={() => setChosen({ ...chosen, [idx]: i })}
                />
                {a.text}
              </label>
            </li>
          ))}
        </ul>
        <button
          className={styles.primary}
          disabled={chosen[idx] == null}
          onClick={() =>
            idx < lesson.test.questions.length - 1 ? setIdx((n) => n + 1) : finishTest()
          }
        >
          {idx < lesson.test.questions.length - 1 ? 'Далее' : 'Отправить'}
        </button>
        {result && (
          <Modal open onClose={() => { setResult(null); handleNext(); }}>
            <h3>{result.passed ? 'Тест пройден 🎉' : 'Результат'}</h3>
            <p>
              Правильных ответов: {result.score} из {result.total}
            </p>
            {!result.passed && (
              <button
                className={styles.primary}
                onClick={() => window.location.reload()}
              >
                Пройти заново
              </button>
            )}
          </Modal>
        )}
        <LessonComments lessonId={lesson.id} onStatusChange={setStatus} />
      </div>
    );
  }

  /* fallback */
  return null;
}
