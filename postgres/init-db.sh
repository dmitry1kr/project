#!/bin/bash
set -e


until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done


pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" /docker-entrypoint-initdb.d/backup.sql