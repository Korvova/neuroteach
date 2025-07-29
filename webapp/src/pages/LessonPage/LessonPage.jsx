import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './LessonPage.module.css';

/* демо‑данные */
const lessons = {
  view: {
    title: 'Введение (просмотр)',
    type: 'view',
    content: (
      <>
        <h4>Текстовый урок</h4>
        <p>Короткое описание того, как работают языковые модели…</p>
      </>
    ),
  },
  file: {
    title: 'Введение (файл)',
    type: 'file',
    content: (
      <>
        <p>Скачайте методичку, выполните задание, затем загрузите готовый PDF.</p>
        <a href="#" download>Скачать задание</a>
      </>
    ),
  },
  test: {
    title: 'Введение (тест)',
    type: 'test',
    content: <p>Ответьте на вопросы, выбрав один вариант из четырёх.</p>,
    questions: [
      {
        id: 1,
        text: 'Чат‑GPT относится к классу…',
        answers: [
          'дискриминативных моделей',
          'генеративных языковых моделей',
          'сверточных сетей',
          'байесовских классификаторов',
        ],
        correct: 1,           // индекс правильного
      },
    ],
  },
};

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [chosen, setChosen] = useState({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const lesson = lessons[lessonId] || { title: 'Урок', type: 'view', content: null };

  const handleNext = () => navigate(-1);        // вернёмся к списку уроков (заглушка)
  const handleFileSend = () => alert('Файл отправлен!');
  const handleTestNext = () => {
    if (questionIdx < lesson.questions.length - 1) {
      setQuestionIdx((i) => i + 1);
    } else {
      alert('Тест завершён 🎉');
      handleNext();
    }
  };

  const q = lesson.questions?.[questionIdx];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{lesson.title}</h2>

      <div className={styles.content}>{lesson.content}</div>

      {/* динамическая нижняя часть */}
      {lesson.type === 'view' && (
        <button className={styles.primary} onClick={handleNext}>
          Далее
        </button>
      )}

      {lesson.type === 'file' && (
        <div className={styles.fileBlock}>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className={styles.primary}
            disabled={!file}
            onClick={handleFileSend}
          >
            Отправить
          </button>
        </div>
      )}

      {lesson.type === 'test' && (
        <div className={styles.testBlock}>
          <p className={styles.counter}>
            {questionIdx + 1}/{lesson.questions.length}
          </p>
          <p className={styles.qtext}>{q.text}</p>
          <ul className={styles.answers}>
            {q.answers.map((a, i) => (
              <li key={i}>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="ans"
                    checked={chosen[questionIdx] === i}
                    onChange={() =>
                      setChosen({ ...chosen, [questionIdx]: i })
                    }
                  />
                  {a}
                </label>
              </li>
            ))}
          </ul>
          <button
            className={styles.primary}
            disabled={chosen[questionIdx] == null}
            onClick={handleTestNext}
          >
            {questionIdx < lesson.questions.length - 1 ? 'Далее' : 'Отправить'}
          </button>
        </div>
      )}

      {/* уточняющий вопрос */}
      <button className={styles.link} onClick={() => setShowModal(true)}>
        Задать уточняющий вопрос
      </button>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              placeholder="Ваш вопрос"
              rows="4"
              className={styles.textarea}
            />
            <input type="file" style={{ margin: '12px 0' }} />
            <div className={styles.mActions}>
              <button className={styles.primary} onClick={() => alert('Отправлено!')}>
                Отправить
              </button>
              <button className={styles.link} onClick={() => setShowModal(false)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
