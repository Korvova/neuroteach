// src/Services/auth.js
import { api } from './api';

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json   = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch (e) {
    console.error('🛠 parseJwt failed', e);
    return {};
  }
}

export async function login(email, password) {
  console.log('🛠 auth.login → start', { email, password });
  try {
    const resp = await api.post('/auth/login', { email, password });
    console.log('🛠 auth.login ← axios response', resp);
    const data = resp.data;
    console.log('🛠 auth.login ← data', data);

    if (!data.token) {
      console.error('🛠 auth.login: token отсутствует в data');
      return null;
    }

    localStorage.setItem('token', data.token);
    const payload = parseJwt(data.token);
    console.log('🛠 auth.login ← payload', payload);

    if (!payload.role) {
      console.error('🛠 auth.login: роль не найдена в payload');
      return null;
    }

    return payload.role;
  } catch (err) {
    // если axios вернул 4xx/5xx, err.response есть
    console.error('🛠 auth.login error', err.response ?? err);
    return null;
  }
}

export function logout() {
  console.log('🛠 auth.logout');
  localStorage.removeItem('token');
}
