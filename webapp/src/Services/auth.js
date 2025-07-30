import { api } from './api';

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const jsonPayload = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonPayload);
    console.log('🛠 parseJwt → payload', payload);
    return payload;
  } catch (e) {
    console.error('🛠 parseJwt failed', e);
    return {};
  }
}

export async function login(email, password) {
  console.log('🛠 auth.login → start', { email, password });
  console.log('🛰 auth.login → using baseURL', api.defaults.baseURL);

  try {
    const resp = await api.post('/api/auth/login', { email, password });
    console.log('🛠 auth.login ← axios response object', resp);
    console.log('🛠 auth.login ← response.data', resp.data);

    if (!resp.data.token) {
      console.error('🛠 auth.login: токен не пришёл');
      return null;
    }

    localStorage.setItem('token', resp.data.token);
    console.log('🛠 auth.login → токен сохранён');

    const payload = parseJwt(resp.data.token);
    if (!payload.role) {
      console.error('🛠 auth.login: роль не найдена в JWT');
      return null;
    }

    console.log('🛠 auth.login → resolved role', payload.role);
    return payload.role;
  } catch (err) {
    if (err.response) {
      console.error('🛠 auth.login error →', err.response.status, err.response.data);
    } else {
      console.error('🛠 auth.login unexpected error', err);
    }
    return null;
  }
}

export function logout() {
  console.log('🛠 auth.logout → clearing token');
  localStorage.removeItem('token');
}
