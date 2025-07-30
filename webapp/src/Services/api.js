import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

/**
 * Заголовок с JWT‑токеном из localStorage.
 * Используем так:  api.get('/url', authHeader())
 */
export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
