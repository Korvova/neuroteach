// src/Services/api.js
import axios from 'axios';

export const api = axios.create({
  // в продакшене все /auth, /courses, /lessons и т.д. будут резолвиться относительно домена
  baseURL: '/',
});

export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
