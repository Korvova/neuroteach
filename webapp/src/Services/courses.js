import { api, authHeader } from './api';

/**
 * GET /api/courses
 */
export async function getCourses() {
  const { data } = await api.get('/api/courses', authHeader());
  return data;
}

/**
 * POST /api/courses
 * body: { title, description, price }
 */
export async function createCourse({ title, description, price }) {
  const { data } = await api.post(
    '/api/courses',
    { title, description, price },
    authHeader()
  );
  return data;
}

/**
 * PUT /api/courses/:id
 * body: { title, description, price }
 */
export async function updateCourse({ id, title, description, price }) {
  const { data } = await api.put(
    `/api/courses/${id}`,
    { title, description, price },
    authHeader()
  );
  return data;
}

/**
 * DELETE /api/courses/:id
 */
export async function deleteCourseAPI(id) {
  return api.delete(`/api/courses/${id}`, authHeader());
}


export async function getCourse(id) {
  const { data } = await api.get(`/api/courses/${id}`, authHeader());
  return data;
}