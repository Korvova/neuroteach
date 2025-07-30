import { api, authHeader } from './api';

export const saveTestResult = (lessonId, score, total) =>
  api.post('/progress', { lessonId, score, total }, authHeader());

