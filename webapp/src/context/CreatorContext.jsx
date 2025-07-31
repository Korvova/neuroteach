import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

export function CreatorProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tests,   setTests]   = useState([]);


  /* ── courses ── */
  const addCourse    = (c) => setCourses((prev) => {
    // если уже есть — не добавляем
    if (prev.find(x => x.id === c.id)) return prev;
    return [...prev, c];
  });
  const editCourse   = (c) => setCourses(courses.map((x) => (x.id === c.id ? c : x)));
  const deleteCourse = (id) => setCourses(courses.filter((c) => c.id !== id));

  /* ── lessons ── */
 


  const addLesson    = (l) => setLessons((prev) => {
    if (prev.find(x => x.id === l.id)) return prev;
    return [...prev, l];
  });
  const editLesson   = (l) => setLessons(lessons.map((x) => (x.id === l.id ? l : x)));
  const deleteLesson = (id) => setLessons(lessons.filter((l) => l.id !== id));



  

 /* ── tests ── */
  const addTest    = (t) => setTests((prev) => prev.find(x => x.id===t.id) ? prev : [...prev, t]);
  const editTest   = (t) => setTests((prev) => prev.map(x => x.id===t.id ? t : x));
  const deleteTest = (id) => setTests((prev) => prev.filter(t => t.id !== id));

  return (
    <Ctx.Provider value={{
      courses, lessons, tests,
      addCourse, editCourse, deleteCourse,
      addLesson, editLesson, deleteLesson,
      addTest, editTest, deleteTest,   // ← не забывай сюда добавить!
    }}>
      {children}
    </Ctx.Provider>
  );
}
export const useCreator = () => useContext(Ctx);
