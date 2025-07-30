import { api } from './api';
import { jwtDecode } from 'jwt-decode';   // ← правильный импорт

export async function login(email, password) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);

    const { role } = jwtDecode(data.token);  // "CREATOR" | "MODERATOR" | …
    return role;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
}
