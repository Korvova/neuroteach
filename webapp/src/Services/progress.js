import { api, authHeader } from './api';

export const saveTestResult = (lessonId, score, total) =>
  api.post('/api/progress', { lessonId, score, total }, authHeader());

