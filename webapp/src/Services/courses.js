import { api, authHeader } from './api';

/**
 * Список всех курсов (без уроков)
 * GET /courses          → [{id,title,price}, …]
 */
export async function getCourses() {
  const { data } = await api.get('/api/courses', authHeader());
  return data;
}

/**
 * Один курс + уроки со статусами
 * GET /courses/:id      → {id,title,description,lessons:[…]}
 */
export async function getCourse(id) {
  const { data } = await api.get(`/api/courses/${id}`, authHeader());
  return data;
}


// создать новый курс
export async function createCourse(title, description, price) {
  const { data } = await api.post(
    '/api/courses',
    { title, description, price },
    authHeader()
  );
  return data;
}


// удалить курс
export async function deleteCourseAPI(id) {
  await api.delete(`/api/courses/${id}`, authHeader());
}