import { useParams, useNavigate } from 'react-router-dom';
import { useCreator } from '../../context/CreatorContext';

import Button from '../../components/Button/Button';
import RichEditor from '../../components/RichEditor';

import { useState } from 'react';
import { createLesson, updateLesson } from '../../Services/lessons';





export default function LessonBuilderPage() {
  const { lessonId } = useParams();          // 'new' | id
  const nav = useNavigate();


  const { lessons, courses, tests, addLesson, editLesson, deleteLesson } = useCreator();

  const existing = lessons.find((l) => l.id === +lessonId);
  const [form, setForm] = useState(
    existing || {
      title: '',
      courseId: courses[0]?.id,
      order: 1,
       checkType: 'VIEW',
      content: '',
      testId: '',
    }
  );


 const save = async () => {
    if (!form.title.trim()) return alert('Название?');
    try {
      if (existing) {
        // обновляем через API
        const updated = await updateLesson(existing.id, {
          courseId: form.courseId,
          order:    form.order,
          title:    form.title,
          content:  form.content,
          checkType: form.checkType,
          testId:   form.checkType === 'TEST' ? form.testId : undefined,
        });
        editLesson(updated);
      } else {
        // создаём новый через API
        const created = await createLesson({
          courseId: form.courseId,
          order:    form.order,
          title:    form.title,
          content:  form.content,
          checkType: form.checkType,
          testId:   form.checkType === 'TEST' ? form.testId : undefined,
        });
        addLesson(created);
      }
      nav('/creator/lessons');
    } 
catch (err) {
    // теперь err доступен
    if (err.response?.status === 409 && err.response.data.error === 'duplicate_order') {
      const { existingId } = err.response.data;
      if (confirm('Урок с таким номером уже есть. Перезаписать?')) {
        const overwritten = await updateLesson(existingId, {
          courseId: form.courseId,
          order:    form.order,
          title:    form.title,
          content:  form.content,
          checkType: form.checkType,
          testId:   form.checkType === 'TEST' ? form.testId : undefined,
        });
        editLesson(overwritten);
        nav('/creator/lessons');
        return;
      }
    }
    alert('Не удалось сохранить урок');
  }



  };


  return (
    <div style={{ maxWidth: 800, marginBottom: 40 }}>
      <h3>{existing ? 'Редактировать урок' : 'Новый урок'}</h3>

      <input
        placeholder="Название урока"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{ width: '100%', padding: 8, margin: '6px 0' }}
      />

      {/* Курс + Номер в одну строку */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '6px 0' }}>
        <label>
          Курс:
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: +e.target.value })}
            style={{ marginLeft: 6, padding: 6 }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Номер урока:
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: +e.target.value })}
            style={{ width: 100, padding: 6, marginLeft: 6 }}
          />
        </label>
      </div>

      <RichEditor
        value={form.content}
        onChange={(v) => setForm({ ...form, content: v })}
      />

      <label style={{ display: 'block', marginTop: 12 }}>
        Проверка:
        <select
 value={form.checkType}
         onChange={(e) => setForm({ ...form, checkType: e.target.value })}
          style={{ marginLeft: 6, padding: 6 }}
        >
            <option value="VIEW">далее</option>
          <option value="FILE">файл</option>
          <option value="TEST">тест</option>
        </select>
      </label>

       {form.checkType === 'TEST' && (
        tests.length ? (
          <select
            value={form.testId || ''}
            onChange={(e) => setForm({ ...form, testId: +e.target.value })}
            style={{ marginTop: 6, padding: 6, width: 260 }}
          >
            <option value="">— выберите тест —</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} (вопросов: {t.questions.length})
              </option>
            ))}
          </select>
        ) : (
          <p style={{ marginTop: 6, color: '#b00' }}>
            Нет созданных тестов. Добавьте их в разделе «Создать тест».
          </p>
        )
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Button onClick={save}>Сохранить</Button>


        {existing && (
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm('Удалить урок?')) {
                deleteLesson(existing.id);
                nav('/creator/lessons');
              }
            }}
          >
            Удалить
          </Button>
        )}


        <Button variant="secondary" onClick={() => nav('/creator/lessons')}>
          Отмена
        </Button>
      </div>
    </div>
  );
}
