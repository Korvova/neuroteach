// src/pages/Creator/TestBuilderPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreator } from '../../context/CreatorContext';
import Button from '../../components/Button/Button';
import { getTest, createTest, updateTest } from '../../Services/tests'; // ← вам нужно реализовать getTest, createTest, updateTest

export default function TestBuilderPage() {
  const { testId } = useParams();      // 'new' | id
  const isNew = testId === 'new';
  const nav = useNavigate();
  const { tests, addTest, editTest } = useCreator();

  // попытка найти в контексте
  const existing = tests.find((t) => t.id === +testId);
  const [title, setTitle] = useState(existing?.title || '');
  const [questions, setQ] = useState(existing?.questions || []);
  const [loading, setLoading] = useState(!isNew && !existing);

  // при монтировании, если это не новый и в контексте нет — подгружаем
  useEffect(() => {
    if (!isNew && !existing) {
      setLoading(true);
      getTest(testId)
        .then((t) => {
          addTest(t);
          setTitle(t.title);
          setQ(t.questions);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isNew, existing, testId, addTest]);

  const addQuestion = () =>
    setQ((qs) => [...qs, { id: Date.now(), text: '', type: 'one', answers: [] }]);

  const saveTest = async () => {
    const payload = { title, questions };
    try {
      if (existing) {
        const updated = await updateTest(existing.id, payload);
        editTest(updated);
      } else {
        const created = await createTest(payload);
        addTest(created);
      }
      nav('/creator/tests');
    } catch (err) {
      console.error(err);
      alert('Не удалось сохранить тест');
    }
  };

  if (loading) return <p>Загружаем тест…</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h3>{existing ? 'Редактировать тест' : 'Новый тест'}</h3>
      <input
        placeholder="Название теста"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: 8, margin: '6px 0' }}
      />

      {questions.map((q, i) => (
        <div key={q.id} style={{ border: '1px solid var(--border)', padding: 12, marginTop: 12 }}>
          <input
            placeholder={`Вопрос ${i + 1}`}
            value={q.text}
            onChange={(e) => {
              const copy = [...questions];
              copy[i].text = e.target.value;
              setQ(copy);
            }}
            style={{ width: '100%', marginBottom: 6 }}
          />

          <label style={{ fontSize: '.8rem' }}>
            <input
              type="radio"
              checked={q.type === 'one'}
              onChange={() => {
                const copy = [...questions];
                copy[i].type = 'one';
                copy[i].answers.forEach((a) => (a.correct = false));
                setQ(copy);
              }}
            /> один вариант
          </label>
          <label style={{ fontSize: '.8rem', marginLeft: 12 }}>
            <input
              type="radio"
              checked={q.type === 'many'}
              onChange={() => {
                const copy = [...questions];
                copy[i].type = 'many';
                setQ(copy);
              }}
            /> несколько вариантов
          </label>

          {q.answers.map((a, ai) => (
            <div key={ai} style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input
                value={a.text}
                onChange={(e) => {
                  const copy = [...questions];
                  copy[i].answers[ai].text = e.target.value;
                  setQ(copy);
                }}
                style={{ flex: 1 }}
              />
              <label>
                <input
                  type={q.type === 'one' ? 'radio' : 'checkbox'}
                  name={`q${q.id}`}
                  checked={a.correct}
                  onChange={() => {
                    const copy = [...questions];
                    if (q.type === 'one') {
                      copy[i].answers.forEach((ans) => (ans.correct = false));
                    }
                    copy[i].answers[ai].correct = !copy[i].answers[ai].correct;
                    setQ(copy);
                  }}
                /> верный
              </label>
              <Button
                variant="secondary"
                onClick={() => {
                  const copy = [...questions];
                  copy[i].answers.splice(ai, 1);
                  setQ(copy);
                }}
              >
                Удалить
              </Button>
            </div>
          ))}

          <Button
            variant="secondary"
            onClick={() => {
              const copy = [...questions];
              copy[i].answers.push({ text: '', correct: false });
              setQ(copy);
            }}
            style={{ marginTop: 6 }}
          >
            + Ответ
          </Button>
        </div>
      ))}

      <Button onClick={addQuestion} style={{ marginTop: 16 }}>
        + Вопрос
      </Button>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button onClick={saveTest}>Сохранить</Button>
        <Button variant="secondary" onClick={() => nav('/creator/tests')}>
          Отмена
        </Button>
      </div>
    </div>
  );
}
