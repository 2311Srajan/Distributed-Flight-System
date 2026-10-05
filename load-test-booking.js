import http from 'k6/http';
import { check } from 'k6';

export const options = { vus: 50, duration: '30s' };

export default function () {
  const payload = JSON.stringify({
    flightNumber: 'AI101',
    passengerName: 'LoadTest',
    seatNumber: '12A',
    status: 'CONFIRMED',
  });
  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('http://localhost:8080/api/bookings', payload, { headers });
  check(res, { 'status is 200': (r) => r.status === 201 });
}
