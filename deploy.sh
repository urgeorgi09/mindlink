#!/bin/bash

# 🚀 Бърз deploy на промените

echo "🔄 Pulling changes from Git..."
git pull origin main

echo "🛑 Stopping containers..."
docker-compose down

echo "🔨 Building frontend with new changes..."
docker-compose build --no-cache frontend

echo "🚀 Starting containers..."
docker-compose up -d

echo "✅ Done! Check logs:"
docker-compose logs -f frontend
