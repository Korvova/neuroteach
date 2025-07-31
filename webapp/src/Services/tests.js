// src/Services/tests.js
import { api, authHeader } from './api';

/** GET /api/tests */
export async function getTests() {
  const { data } = await api.get('/api/tests', authHeader());
  return data;
}

/** GET /api/tests/:id */
export async function getTest(id) {
  const { data } = await api.get(`/api/tests/${id}`, authHeader());
  return data;
}

/** POST /api/tests */
export async function createTest(test) {
  const { data } = await api.post('/api/tests', test, authHeader());
  return data;
}

/** PUT /api/tests/:id */
export async function updateTest(id, test) {
  const { data } = await api.put(`/api/tests/${id}`, test, authHeader());
  return data;
}



/** DELETE /api/tests/:id */
export async function deleteTest(id) {
  return api.delete(`/api/tests/${id}`, authHeader());
}
