import { api, authHeader } from './api';

export async function uploadFile(lessonId, file) {
  const form = new FormData();
  form.append('lessonId', lessonId);
  form.append('file', file);

  // объединяем заголовки: авторизация + multipart
  const headers = {
    ...authHeader().headers,
    'Content-Type': 'multipart/form-data'
  };

  const { data } = await api.post('/api/upload', form, { headers });
  return data;
}
