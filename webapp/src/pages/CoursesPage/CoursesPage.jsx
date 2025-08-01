import { useState, useEffect } from 'react';
import { useCreator } from '../../context/CreatorContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import RichEditor from '../../components/RichEditor'; 
import { getCourse }   from '../../Services/courses';

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourseAPI
} from '../../Services/courses';

export default function CreatorCoursesPage() {
  const { courses, addCourse, editCourse, deleteCourse } = useCreator();
  const [modalData, setModalData] = useState(null);
  const isEdit = Boolean(modalData?.id);

  // При первой загрузке подгружаем курсы
  useEffect(() => {
    if (courses.length === 0) {
      getCourses().then((list) => list.forEach((c) => addCourse(c)));
    }
  }, [courses.length, addCourse]);

  // Короткий текст для превью
  const preview = (desc) => {
    try {
      const raw = JSON.parse(desc);
      if (raw?.blocks) {
        const text = raw.blocks.map((b) => b.text).join(' ');
        return text.length > 40 ? text.slice(0, 40) + '…' : text;
      }
    } catch {}
    const plain = desc.replace(/<[^>]+>/g, '');
    return plain.length > 40 ? plain.slice(0, 40) + '…' : plain;
  };

  // Сортируем курсы по id в порядке возрастания
  const sortedCourses = [...courses].sort((a, b) => a.id - b.id);

  const rows = sortedCourses.map((c) => [
    c.id,
    c.title,
    preview(c.description || ''),
    c.price != null ? `${c.price} ₽` : '—',
    <Button key={c.id} variant="secondary" onClick={() => setModalData(c)}>
      Редактировать
    </Button>
  ]);

  const save = async () => {
    if (!modalData.title.trim()) {
      return alert('Пожалуйста, введите название');
    }

    try {
      if (isEdit) {
        const updated = await updateCourse({
          id:          modalData.id,
          title:       modalData.title,
          description: modalData.description,
          price:       modalData.price ? Number(modalData.price) : null
        });
        editCourse(updated);
      } else {
        const created = await createCourse({
          title:       modalData.title,
          description: modalData.description,
          price:       modalData.price ? Number(modalData.price) : null
        });
        addCourse(created);
      }
      setModalData(null);
    } catch {
      alert('Не удалось сохранить курс');
    }
  };

  const onDelete = async () => {
    if (!confirm('Удалить курс?')) return;
    try {
      await deleteCourseAPI(modalData.id);
      deleteCourse(modalData.id);
      setModalData(null);
    } catch {
      alert('Не удалось удалить курс');
    }
  };

  return (
    <>
      <Button onClick={() => setModalData({ title: '', description: '', price: '' })}>
        Создать курс
      </Button>

      <Table
        head={['ID', 'Название', 'Описание', 'Стоимость', '']}
        rows={rows}
      />

      <Modal open={!!modalData} onClose={() => setModalData(null)}>
        {modalData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 350 }}>
            <h3>{isEdit ? 'Редактировать курс' : 'Новый курс'}</h3>

            <input
              placeholder="Название"
              value={modalData.title}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              style={{ padding: 8 }}
            />

            <RichEditor
              value={modalData.description}
              onChange={(v) => setModalData({ ...modalData, description: v })}
              height={160}
            />

            <input
              type="number"
              placeholder="Стоимость, ₽"
              value={modalData.price}
              onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
              style={{ padding: 8, width: 120 }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button onClick={save}>Сохранить</Button>
              {isEdit && <Button variant="secondary" onClick={onDelete}>Удалить</Button>}
              <Button variant="secondary" onClick={() => setModalData(null)}>
                Отмена
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}