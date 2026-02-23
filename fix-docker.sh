#!/bin/bash

echo "🔧 Fixing MindLink+ Docker issues..."

# Stop all containers
echo "⏹️ Stopping containers..."
docker-compose down

# Remove orphaned containers
echo "🧹 Cleaning up..."
docker system prune -f

# Recreate network
echo "🌐 Recreating network..."
docker network rm mindlink_default 2>/dev/null || true
docker network create mindlink_default

# Start database first
echo "🐘 Starting database..."
docker-compose up -d mindlink-db

# Wait for database
echo "⏳ Waiting for database..."
sleep 10

# Check database health
echo "🔍 Checking database..."
docker exec mindlink-db pg_isready -U postgres -d mindlink

# Start backend
echo "🚀 Starting backend..."
docker-compose up -d backend

# Wait for backend
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
docker-compose up -d frontend

# Show status
echo "✅ Status:"
docker-compose ps

echo "📊 Logs:"
docker logs mindlink-backend --tail 20
