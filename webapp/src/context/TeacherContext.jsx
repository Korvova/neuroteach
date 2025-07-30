import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

/* мок‑данные */
const initReview = [
  { id: 1, course: 'Вход в нейросети', lesson: 'Введение (файл)', user: 'Анна Иванова', file: 'report.pdf' },
];
const initClarify = [
  { id: 10, course: 'Вход в нейросети', lesson: 'Демонстрация ChatGPT', user: 'Борис Кузнецов', q: 'Не открывается ссылка', status: 'ждёт уточнения' },
];

export function TeacherProvider({ children }) {
  const [review, setReview] = useState(initReview);
  const [clarify, setClarify] = useState(initClarify);

  const approve = (id) =>
    setReview(review.filter((r) => r.id !== id));

  const requestRedo = (id, comment) => {
    setReview(review.filter((r) => r.id !== id));
    alert(`Комментарий студенту: ${comment}`);
  };

  const answerQ = (id, text) =>
    setClarify(
      clarify.map((c) => (c.id === id ? { ...c, status: 'отвечен', a: text } : c))
    );

  return (
    <Ctx.Provider value={{ review, clarify, approve, requestRedo, answerQ }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTeacher = () => useContext(Ctx);
