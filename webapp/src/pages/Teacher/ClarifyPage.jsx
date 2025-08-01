import { useState, useEffect } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { answerLessonComment } from '../../Services/lessonComments';

export default function ClarifyPage() {
  const { clarify, answerQ } = useTeacher();
  const [item, setItem] = useState(null);       // выбранный для ответа элемент
  const [answer, setAnswer] = useState('');     // текст ответа
  const [sending, setSending] = useState(false);// индикатор отправки

  // Лог payload для дебага
  useEffect(() => {
    console.log('🔍 ClarifyPage: clarify payload =', clarify);
  }, [clarify]);

  // Формируем строки таблицы, извлекая только нужные поля (примитивы)
  const rows = Array.isArray(clarify)
    ? clarify.map((c) => [
        c.id,                                          // ID комментария
        c.lesson.course.title,                         // Название курса
        c.lesson.title,                                // Название урока
        `${c.user.firstName} ${c.user.lastName}`,     // ФИО студента
        c.meta?.question || '—',                       // Вопрос из meta
        <Button
          key={c.id}
          variant="secondary"
          style={{ padding: '4px 10px' }}
          onClick={() => setItem(c)}                  // открыть модалку
        >
          Открыть
        </Button>,
      ])
    : [];

  // Обработчик отправки ответа преподавателя
  const handleSend = async () => {
    if (!answer.trim() || !item?.meta?.commentId) {
      alert('Введите ответ или отсутствует commentId');
      return;
    }
    setSending(true);
    try {
      // Сначала сохраняем ответ в таблице lessonComment
      await answerLessonComment(item.meta.commentId, answer.trim());
      // Затем обновляем локальный стейт clarify в контексте
      await answerQ(item.user.id, item.lesson.id, answer.trim());
      // Закрываем модалку и очищаем форму
      setItem(null);
      setAnswer('');
    } catch (e) {
      alert('Не удалось отправить ответ');
      console.error('Error sending answer:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Таблица с запросами на уточнение */}
      <Table head={['ID', 'Курс', 'Урок', 'ФИО', 'Вопрос', '']} rows={rows} />

      {/* Модальное окно для ответа */}
      <Modal
        open={!!item}
        onClose={() => {
          setItem(null);
          setAnswer('');
        }}
      >
        {item && (
          <>
            {/* Заголовок урока */}
            <h3>{item.lesson.title}</h3>

            {/* Блок с деталями вопроса */}
            <div
              style={{
                background: '#f5f5f5',
                padding: 12,
                borderRadius: 8,
                maxHeight: 150,
                overflow: 'auto'
              }}
            >
              <p>
                <strong>Студент:</strong> {item.user.firstName} {item.user.lastName}
              </p>
              <p>
                <strong>Вопрос:</strong> {item.meta?.question || '—'}
              </p>
              {/* Если уже есть ответ в meta, показываем его */}
              {item.meta?.reply && (
                <p>
                  <strong>Предыдущий ответ:</strong> {item.meta.reply}
                </p>
              )}
            </div>

            {/* Поле ввода ответа */}
            <textarea
              rows="4"
              placeholder="Ваш ответ…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ width: '100%', marginTop: 12 }}
            />

            {/* Кнопка отправки */}
            <Button
              variant="success"
              onClick={handleSend}
              disabled={sending || !answer.trim()}
            >
              {sending ? 'Отправляем...' : 'Отправить ответ'}
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
