// src/pages/Creator/LessonBuilderPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useCreator } from '../../context/CreatorContext';
import { useState, useEffect } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

import Button from '../../components/Button/Button';
import RichEditor from '../../components/RichEditor';
import { createLesson, updateLesson, getLesson } from '../../Services/lessons';

export default function LessonBuilderPage() {
  const { lessonId } = useParams();           // "new" или числовой id
  const nav = useNavigate();
  const isNew = lessonId === 'new';

  const { addLesson, editLesson, courses, tests } = useCreator();

  // мета-данные урока
  const [meta, setMeta] = useState({
    title:     '',
    courseId:  courses[0]?.id || null,
    order:     1,
    checkType: 'VIEW',
    testId:    '',
  });

  // состояние редактора DraftJS
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // при редактировании — загрузить из API
  useEffect(() => {
    if (!isNew) {
      getLesson(lessonId).then((data) => {
        setMeta({
          title:     data.title,
          courseId:  data.courseId,
          order:     data.order,
          checkType: data.checkType,
          testId:    data.testId || '',
        });
        // инициализируем редактор из raw JSON
        const raw = typeof data.content === 'string'
          ? JSON.parse(data.content)
          : data.content;
        setEditorState(EditorState.createWithContent(convertFromRaw(raw)));
      });
    }
  }, [lessonId]);

  const save = async () => {
    if (!meta.title.trim()) {
      alert('Пожалуйста, введите название урока');
      return;
    }

    const payload = {
      ...meta,
      content: convertToRaw(editorState.getCurrentContent()),
    };

    try {
      if (isNew) {
        const created = await createLesson(payload);
        addLesson(created);
      } else {
        const updated = await updateLesson(lessonId, payload);
        editLesson(updated);
      }
      nav('/creator/lessons');
    } catch (err) {
      if (
        err.response?.status === 409 &&
        err.response.data.error === 'duplicate_order'
      ) {
        const { existingId } = err.response.data;
        if (
          window.confirm(
            'Урок с таким номером уже есть. Перезаписать его?'
          )
        ) {
          const overwritten = await updateLesson(existingId, payload);
          editLesson(overwritten);
          nav('/creator/lessons');
          return;
        }
      }
      alert('Не удалось сохранить урок');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h3>{isNew ? 'Новый урок' : 'Редактировать урок'}</h3>

      <input
        type="text"
        placeholder="Название урока"
        value={meta.title}
        onChange={(e) => setMeta({ ...meta, title: e.target.value })}
        style={{ width: '100%', padding: 8, margin: '12px 0' }}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select
          value={meta.courseId}
          onChange={(e) =>
            setMeta({ ...meta, courseId: +e.target.value })
          }
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={meta.order}
          onChange={(e) =>
            setMeta({ ...meta, order: +e.target.value })
          }
          style={{ width: 80 }}
        />
      </div>

      <RichEditor
        editorState={editorState}
        onChange={setEditorState}
        style={{ minHeight: 200, marginBottom: 12 }}
      />

      <div style={{ margin: '12px 0' }}>
        <label>Тип проверки:&nbsp;</label>
        <select
          value={meta.checkType}
          onChange={(e) =>
            setMeta({ ...meta, checkType: e.target.value })
          }
        >
          <option value="VIEW">Далее</option>
          <option value="FILE">Файл</option>
          <option value="TEST">Тест</option>
        </select>
      </div>

      {meta.checkType === 'TEST' && (
        <div style={{ marginBottom: 12 }}>
          <select
            value={meta.testId}
            onChange={(e) =>
              setMeta({ ...meta, testId: +e.target.value })
            }
          >
            <option value="">— выберите тест —</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.questions.length})
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Button onClick={save}>Сохранить</Button>
        <Button variant="secondary" onClick={() => nav('/creator/lessons')}>
          Отмена
        </Button>
      </div>
    </div>
  );
}
