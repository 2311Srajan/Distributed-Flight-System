import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp-up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp-down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<120'], // 95% of requests must complete below 120ms
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
