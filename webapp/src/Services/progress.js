import { api, authHeader } from './api';

export const saveTestResult = (lessonId, score, total) =>
  api.post('/api/progress', { lessonId, score, total }, authHeader());

// получить все комментарии по уроку
export async function getLessonComments(lessonId) {
  const { data } = await api.get(`/api/lessonComments/${lessonId}`, authHeader());
  return data;
}



// отметить VIEW-урок как COMPLETED
export async function completeLesson(lessonId) {
  const { data } = await api.post(
    '/api/progress/complete',
    { lessonId },
    authHeader()
  );
  return data;
}



// отправить новый комментарий (вопрос) по уроку
export async function sendLessonComment(lessonId, text) {
  const { data } = await api.post(
    `/api/lessonComments/${lessonId}`,
    { text },
    authHeader()
  );
  return data;
}


