import { api, authHeader } from './api';

/**
 * Список всех курсов (без уроков)
 * GET /courses          → [{id,title,price}, …]
 */
export async function getCourses() {
  const { data } = await api.get('/courses', authHeader());
  return data;
}

/**
 * Один курс + уроки со статусами
 * GET /courses/:id      → {id,title,description,lessons:[…]}
 */
export async function getCourse(id) {
  const { data } = await api.get(`/courses/${id}`, authHeader());
  return data;
}
