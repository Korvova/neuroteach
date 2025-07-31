import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

export function CreatorProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tests,   setTests]   = useState([]);

  /* ── courses ── */
 const addCourse    = (c) => setCourses((prev) => [...prev, c]); 
  const editCourse   = (c) => setCourses(courses.map((x) => (x.id === c.id ? c : x)));
  const deleteCourse = (id) => setCourses(courses.filter((c) => c.id !== id));

  /* ── lessons ── */
  const addLesson    = (l) => setLessons([...lessons, l]);
  const editLesson   = (l) => setLessons(lessons.map((x) => (x.id === l.id ? l : x)));
  const deleteLesson = (id) => setLessons(lessons.filter((l) => l.id !== id));

  /* ── tests (без удаления пока) ── */
  const addTest  = (t) => setTests([...tests, t]);
  const editTest = (t) => setTests(tests.map((x) => (x.id === t.id ? t : x)));

  return (
    <Ctx.Provider
      value={{
        courses,
        lessons,
        tests,
        addCourse,
        editCourse,
        deleteCourse,
        addLesson,
        editLesson,
        deleteLesson,
        addTest,
        editTest,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useCreator = () => useContext(Ctx);
