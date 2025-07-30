import { api } from './api';

export function uploadFile(lessonId, file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('lessonId', lessonId);


  return api.post('/upload', fd)   // boundary проставит axios
           .then(r => r.data);


}
