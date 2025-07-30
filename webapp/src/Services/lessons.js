// src/Services/lessons.js
import { api, authHeader } from './api';

/* ── получить урок ───────────────────────────── */
export async function getLesson(id) {
  const { data } = await api.get(`/api/lessons/${id}`, authHeader());
  return data;                            // { id, title, checkType, … }
}




/* ── загрузка файла для FILE‑урока ───────────── */
export async function uploadFile(lessonId, file) {
  const fd = new FormData();
  fd.append('file',     file);
  fd.append('lessonId', lessonId);

  return api.post('/api/upload', fd, {
    ...authHeader(),                          // JWT
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);                       // { ok:true, url:'…' }
}

/* ── сохранить итог теста ────────────────────── */
export async function saveTestResult(lessonId, score, total) {
  return api.post('/api/progress', { lessonId, score, total }, authHeader());
}
