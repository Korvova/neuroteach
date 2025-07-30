// src/Services/auth.js
import { api } from './api';

/**
 * Выполняет логин, сохраняет токен и возвращает роль пользователя.
 */
export async function login(email, password) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    const token = data.token;
    localStorage.setItem('token', token);

    // вручную декодируем payload JWT и достаём role
    const [, payloadBase64] = token.split('.');
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const { role } = JSON.parse(payloadJson);

    return role; // e.g. "STUDENT" | "CREATOR" | "MODERATOR" | "TEACHER"
  } catch {
    return null;
  }
}

export function logout() {
localStorage.removeItem('token');
}