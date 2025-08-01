// src/Services/teacher.js
import { api, authHeader } from './api';

export async function getReview() {
  const { data } = await api.get('/api/teacher/review', authHeader());
  return data;
}

export async function getClarify() {
  const { data } = await api.get('/api/teacher/clarify', authHeader());
  return data;
}

export async function reviewAction(userId, lessonId, action, comment = '') {
  return api.patch(
    `/api/teacher/review/${userId}/${lessonId}`,
    { action, comment },
    authHeader()
  );
}

export async function clarifyReply(userId, lessonId, reply) {
  return api.patch(
    `/api/teacher/clarify/${userId}/${lessonId}`,
    { reply },
    authHeader()
  );
}


/**
 * GET /api/teacher/review/:userId/:lessonId/submission
 */
export async function getSubmission(userId, lessonId) {
  const { data } = await api.get(
    `/api/teacher/review/${userId}/${lessonId}/submission`,
    authHeader()
  );
  return data; // либо { filePath, comment, createdAt }, либо null
}





