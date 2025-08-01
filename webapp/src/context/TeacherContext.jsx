// src/context/TeacherContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getReview, getClarify, reviewAction, clarifyReply } from '../Services/teacher';

const Ctx = createContext(null);

export function TeacherProvider({ children }) {
  const [review, setReview]   = useState([]);
  const [clarify, setClarify] = useState([]);

  // загрузка при монтировании
  useEffect(() => {
    getReview().then(setReview).catch(console.error);
    getClarify().then(setClarify).catch(console.error);
  }, []);

  const approve = async (userId, lessonId) => {
    await reviewAction(userId, lessonId, 'READY');
    setReview((r) => r.filter(it => !(it.user.id===userId && it.lesson.id===lessonId)));
  };

  const requestRedo = async (userId, lessonId, comment) => {
    await reviewAction(userId, lessonId, 'REDO', comment);
    setReview((r) => r.filter(it => !(it.user.id===userId && it.lesson.id===lessonId)));
  };

  const answerQ = async (userId, lessonId, reply) => {
    await clarifyReply(userId, lessonId, reply);
    setClarify((c) => c.filter(it => !(it.user.id===userId && it.lesson.id===lessonId)));
  };

  return (
    <Ctx.Provider value={{ review, clarify, approve, requestRedo, answerQ }}>
      {children}
    </Ctx.Provider>
  );
}
export const useTeacher = () => useContext(Ctx);

