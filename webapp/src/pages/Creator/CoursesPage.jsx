
import { useState, useEffect } from 'react';
import { useCreator } from '../../context/CreatorContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import RichEditor from '../../components/RichEditor';

import { getCourses, createCourse, deleteCourseAPI } from '../../Services/courses';

export default function CreatorCoursesPage() {
  const { courses, addCourse, editCourse, deleteCourse } = useCreator();
  const [modalData, setModalData] = useState(null);
  const isEdit = !!modalData?.id;


  // При первой загрузке подгружаем реальные курсы из API
  useEffect(() => {
    getCourses().then((list) => list.forEach((c) => addCourse(c)));
  }, []);




  /* 🔹 утилита превью */
  const preview = (desc) => {
    // попытка распарсить DraftJS raw
    try {
      const raw = JSON.parse(desc);
      if (raw?.blocks) {
        const text = raw.blocks.map((b) => b.text).join(' ');
        return slice(text);
      }
    } catch (_) {}
    // если не JSON — режем HTML / Markdown
    return slice(stripHtml(desc));
  };
  const slice = (txt) => (txt.length > 40 ? txt.slice(0, 40) + '…' : txt);
  const stripHtml = (h) => h.replace(/<[^>]+>/g, '');

  const rows = courses.map((c) => [
    c.id,
    c.title,
    preview(c.desc || ''),
    c.price ? `${c.price} ₽` : '—',
    <Button key={c.id} variant="secondary" onClick={() => setModalData(c)}>
      Редактировать
    </Button>,
  ]);

  const save = async () => {
    if (!modalData.title.trim()) return alert('Название?');
    if (isEdit) {
      editCourse(modalData);
    } else {
      try {
        // создаём на бэке
        const created = await createCourse(
          modalData.title,
          modalData.desc,
          modalData.price ? Number(modalData.price) : null
        );
        addCourse(created);  // добавляем в контекст
      } catch {
        return alert('Не удалось создать курс');
      }
    }
    setModalData(null);
  };


  return (
    <>
      <Button onClick={() => setModalData({ title: '', desc: '', price: '' })}>
        Создать курс
      </Button>

      <Table head={['ID', 'Название', 'Описание', 'Стоимость', '']} rows={rows} />

      <Modal open={!!modalData} onClose={() => setModalData(null)}>
        {modalData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3>{isEdit ? 'Редактировать курс' : 'Новый курс'}</h3>

            <input
              placeholder="Название"
              value={modalData.title}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              style={{ padding: 8 }}
            />

            <RichEditor
              value={modalData.desc}
              onChange={(v) => setModalData({ ...modalData, desc: v })}
              height={160}
            />

            <input
              type="number"
              placeholder="Стоимость, ₽"
              value={modalData.price}
              onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
              style={{ width: 180, padding: 8 }}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <Button onClick={save}>Сохранить</Button>


 {isEdit && (
                <Button
                  variant="secondary"
                onClick={async () => {
                    if (confirm('Удалить курс?')) {
                     

     try {
       await deleteCourseAPI(modalData.id);
       deleteCourse(modalData.id); // из контекста
     } catch {
       alert('Не удалось удалить курс');
       return;
     }


                      setModalData(null);
                    }
                  }}
                >
                  Удалить
                </Button>
              )}


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
