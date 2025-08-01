// src/Services/teacher.js
import { api, authHeader } from './api';

export async function getReview() {
  // раньше: api.get('/teacher/review')
  const { data } = await api.get('/api/teacher/review', authHeader());
  return data;
}

export async function reviewAction(userId, lessonId, action, comment = '') {
  return api.patch(
    `/api/teacher/review/${userId}/${lessonId}`,   // добавили `/api`
    { action, comment },
    authHeader()
  );
}

export async function clarifyReply(userId, lessonId, reply) {
  return api.patch(
    `/api/teacher/clarify/${userId}/${lessonId}`,  // добавили `/api`
    { reply },
    authHeader()
  );
}

export async function getClarify() {
  const { data } = await api.get('/api/teacher/clarify', authHeader());
  return data;
}




