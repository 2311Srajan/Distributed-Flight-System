#!/usr/bin/env bash
# deploy.sh - build, start and health-check the Distributed Flight System stack.
# Usage: ./deploy.sh [up|down|status|logs]   (default: up)
# Override defaults with env vars, e.g.:  BOOKING_URL=http://localhost:8080/actuator/health ./deploy.sh
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
BOOKING_URL="${BOOKING_URL:-http://localhost:8080/}"   # booking-service (Kotlin / Spring Boot)
TRACKING_URL="${TRACKING_URL:-http://localhost:3000/}" # tracking-service (Node / Express)
RETRIES="${RETRIES:-30}"
SLEEP_SECS="${SLEEP_SECS:-2}"

log()  { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
fail() { log "ERROR: $*" >&2; exit 1; }

# Pick "docker compose" (v2) or "docker-compose" (v1)
if docker compose version >/dev/null 2>&1; then
  DC=(docker compose -f "$COMPOSE_FILE")
elif command -v docker-compose >/dev/null 2>&1; then
  DC=(docker-compose -f "$COMPOSE_FILE")
else
  fail "Docker Compose is not installed."
fi

preflight() {
  command -v docker >/dev/null 2>&1 || fail "Docker is not installed."
  docker info >/dev/null 2>&1      || fail "Docker daemon is not running."
  [[ -f "$COMPOSE_FILE" ]]         || fail "$COMPOSE_FILE not found. Run this from the repo root."
}

# Wait until a URL answers with any HTTP response (2xx-4xx counts as 'up')
wait_for() {
  local name="$1" url="$2" i code
  for ((i = 1; i <= RETRIES; i++)); do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$url" || true)"
    if [[ "$code" =~ ^[234][0-9][0-9]$ ]]; then
      log "$name is healthy ($url -> HTTP $code)"
      return 0
    fi
    log "Waiting for $name ($i/$RETRIES)..."
    sleep "$SLEEP_SECS"
  done
  log "$name did not become healthy. Last container logs:"
  "${DC[@]}" logs --tail=40 || true
  return 1
}

cmd_up() {
  preflight
  log "Building images..."
  "${DC[@]}" build
  log "Starting services..."
  "${DC[@]}" up -d
  wait_for "booking-service"  "$BOOKING_URL"
  wait_for "tracking-service" "$TRACKING_URL"
  log "Deployment OK."
  "${DC[@]}" ps
}

cmd_down()   { preflight; log "Stopping services..."; "${DC[@]}" down; }
cmd_status() { preflight; "${DC[@]}" ps; }
cmd_logs()   { preflight; "${DC[@]}" logs --tail=100 -f; }

case "${1:-up}" in
  up)     cmd_up ;;
  down)   cmd_down ;;
  status) cmd_status ;;
  logs)   cmd_logs ;;
  *)      fail "Unknown command '$1'. Use: up | down | status | logs" ;;
esac
