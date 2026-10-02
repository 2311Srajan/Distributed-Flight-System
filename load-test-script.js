import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<120'],
  },
};

export default function () {
  const url = 'http://localhost:8080/api/v1/flights/search?from=DEL&to=BOM&date=2026-10-15';
  const res = http.get(url);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time < 120ms': (r) => r.timings.duration < 120,
  });

  sleep(1);
}
