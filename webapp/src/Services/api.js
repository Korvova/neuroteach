// src/Services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// лог запросов
api.interceptors.request.use(req => {
  console.log('🛰 [axios] request:', req.method.toUpperCase(), req.url, req.data);
  return req;
});

// лог ответов / ошибок
api.interceptors.response.use(
  resp => {
    console.log('🛰 [axios] response:', resp.status, resp.data);
    return resp;
  },
  err => {
    console.error('🛰 [axios] response error:', err.response?.status, err.response?.data, err.message);
    return Promise.reject(err);
  }
);

export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
