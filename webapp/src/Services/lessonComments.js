// src/Services/lessonComments.js
import { api, authHeader } from './api';

// Отправить ответ преподавателя на комментарий
export async function answerLessonComment(commentId, answer) {
  const { data } = await api.post(
    `/api/lessonComments/${commentId}/answer`,
    { answer },
    authHeader()
  );
  return data;
}