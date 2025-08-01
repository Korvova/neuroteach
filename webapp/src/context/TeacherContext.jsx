// src/context/TeacherContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import * as teacherAPI from '../Services/teacher';

const Ctx = createContext();

export function TeacherProvider({ children }) {
  const [review,  setReview]  = useState([]);
  const [clarify, setClarify] = useState([]);

  // при монтировании подгружаем данные
  useEffect(() => {
    teacherAPI.getReview().then(setReview).catch(console.error);
    teacherAPI.getClarify().then(setClarify).catch(console.error);
  }, []);

  // подтвердить / вернуть на доработку
  const approve = async (userId, lessonId) => {
    await teacherAPI.reviewAction(userId, lessonId, 'READY');
    setReview((r) => r.filter((x) => !(+x.user.id===+userId && +x.lesson.id===+lessonId)));
  };

  const requestRedo = async (userId, lessonId, comment) => {
    await teacherAPI.reviewAction(userId, lessonId, 'RETURN', comment);
    setReview((r) => r.filter((x) => !(+x.user.id===+userId && +x.lesson.id===+lessonId)));
  };

  // ответить на уточнение
  const answerQ = async (userId, lessonId, reply) => {
    await teacherAPI.clarifyReply(userId, lessonId, reply);
    setClarify((c) =>
      c.map((x) =>
        +x.user.id===+userId && +x.lesson.id===+lessonId
          ? { ...x, status: 'IN_PROGRESS', meta: { reply } }
          : x
      )
    );
  };

  return (
    <Ctx.Provider value={{ review, clarify, approve, requestRedo, answerQ }}>
      {children}
    </Ctx.Provider>
  );
}
export const useTeacher = () => useContext(Ctx);
