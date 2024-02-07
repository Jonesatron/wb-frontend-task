import { http, HttpResponse } from 'msw';
import branch1 from '../../public/api/branch1.json';
import branch2 from '../../public/api/branch2.json';
import branch3 from '../../public/api/branch3.json';

export const handlers = [
  http.get('/api/branch1.json', () => {
    return HttpResponse.json(branch1);
  }),
  http.get('/api/branch2.json', () => {
    return HttpResponse.json(branch2);
  }),
  http.get('/api/branch3.json', () => {
    return HttpResponse.json(branch3);
  }),
];
