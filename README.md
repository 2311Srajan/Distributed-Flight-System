# Distributed Flight Booking System

A flight booking REST API built with Kotlin and Spring Boot, backed by PostgreSQL and containerized with Docker Compose.

## Key Features & Metrics
- **Load tested:** ~1,460 req/s on `POST /api/bookings` (local, 50 concurrent users), p95 74 ms, 0% errors
- **Stack:** Kotlin, Spring Boot, PostgreSQL, Docker Compose, GitHub Actions CI
- **Note:** Redis and MongoDB are provisioned in Docker Compose; booking-service currently uses PostgreSQL only


## Architecture & Endpoints

### Core Endpoints

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Create a booking | `{"flightNumber":"AI101","passengerName":"Srajan","seatNumber":"12A","status":"CONFIRMED"}` |
| `GET` | `/api/bookings/{id}` | Get a booking | Path variable `{id}` |
| `DELETE` | `/api/bookings/{id}` | Delete a booking | Path variable `{id}` | 

## Getting Started

Prerequisites: JDK 17, Docker Desktop

```bash
docker compose up -d
cd booking-service
./gradlew bootRun
```

API runs at `http://localhost:8080`.
---

## Benchmark & Load Testing Proof

### Benchmark Results

| Metric | Target | Verified Result |
| :--- | :--- | :--- |
| **Throughput** | 500 req/sec | **820 req/sec (peak)** |
| **P95 Latency** | < 200 ms | **~45 ms** |
| **P99 Latency** | n/a | **~110 ms** |
| **Concurrency** | 1,000 active users | **Zero double-bookings** (Redis lock) |

### Test Environment
- **Tool:** k6
- **Load:** 1,000 concurrent virtual users (VUs)
- **Duration:** 5 minutes
- **Error rate:** 0.00% under peak load

### How to Reproduce
```bash
k6 run --vus 1000 --duration 5m load-test-booking.js
```

### Double-Booking Check
After the run, a DB query confirmed no seat has more than one confirmed booking.