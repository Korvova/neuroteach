import { api, authHeader } from './api';

export const saveTestResult = (lessonId, score, total) =>
  api.post('/lesson-progress',
           { lessonId, score, total },
           authHeader());              // ← токен
