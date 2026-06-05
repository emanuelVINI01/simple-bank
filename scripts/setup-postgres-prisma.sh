#!/usr/bin/env bash
set -euo pipefail

APP_USER="${SUDO_USER:-$USER}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-ledger_db}"
DB_USER="${DB_USER:-ledger_user}"
DB_PASSWORD="${DB_PASSWORD:-ledger_password}"
DB_SCHEMA="${DB_SCHEMA:-public}"
MIGRATION_NAME="${MIGRATION_NAME:-init}"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script with sudo:"
  echo "  sudo bash scripts/setup-postgres-prisma.sh"
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql was not found. Install PostgreSQL client/server first."
  exit 1
fi

echo "Creating/updating PostgreSQL role '${DB_USER}'..."
sudo -u postgres psql -v ON_ERROR_STOP=1 \
  -v db_user="${DB_USER}" \
  -v db_password="${DB_PASSWORD}" <<'SQL'
SELECT format('CREATE ROLE %I WITH LOGIN PASSWORD %L CREATEDB', :'db_user', :'db_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'db_user')
\gexec
SELECT format('ALTER ROLE %I WITH LOGIN PASSWORD %L CREATEDB', :'db_user', :'db_password')
\gexec
SQL

echo "Creating PostgreSQL database '${DB_NAME}' if needed..."
sudo -u postgres psql -v ON_ERROR_STOP=1 \
  -v db_name="${DB_NAME}" \
  -v db_user="${DB_USER}" <<'SQL'
SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'db_name')
\gexec
SQL

echo "Ensuring schema '${DB_SCHEMA}' is owned by '${DB_USER}'..."
sudo -u postgres psql -v ON_ERROR_STOP=1 \
  -d "${DB_NAME}" \
  -v db_schema="${DB_SCHEMA}" \
  -v db_user="${DB_USER}" <<'SQL'
SELECT format('CREATE SCHEMA IF NOT EXISTS %I AUTHORIZATION %I', :'db_schema', :'db_user')
\gexec
SELECT format('ALTER SCHEMA %I OWNER TO %I', :'db_schema', :'db_user')
\gexec
SQL

cd "${APP_DIR}"

if [[ ! -f ".env.local" ]]; then
  echo "Creating .env.local..."
  cat > .env.local <<EOF
NEXT_PUBLIC_GITHUB_URL="https://github.com/emanuelVINI01"
DATABASE_URL="${DATABASE_URL}"
AUTH_SECRET="local-development-auth-secret-with-at-least-32-characters"
AUTH_URL="http://localhost:3000"
EOF
  chown "${APP_USER}:${APP_USER}" .env.local
else
  echo ".env.local already exists. Leaving it unchanged."
fi

export DATABASE_URL

run_as_app_user() {
  sudo -u "${APP_USER}" env \
    DATABASE_URL="${DATABASE_URL}" \
    AUTH_SECRET="${AUTH_SECRET:-local-development-auth-secret-with-at-least-32-characters}" \
    AUTH_URL="${AUTH_URL:-http://localhost:3000}" \
    "$@"
}

echo "Generating Prisma client..."
run_as_app_user npm run prisma:generate

echo "Running Prisma migration..."
if ! run_as_app_user npx prisma migrate dev --name "${MIGRATION_NAME}"; then
  echo "Prisma migrate dev failed. Continuing with prisma db push..."
fi

echo "Running Prisma db push..."
run_as_app_user npm run prisma:push

echo "Done."
echo "DATABASE_URL=${DATABASE_URL}"
