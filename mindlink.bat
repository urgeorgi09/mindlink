@echo off
echo Starting MindLink...

echo -------------------------
echo 🚀 Starting BACKEND...
echo -------------------------
start cmd /k "cd backend && node src/server.js"

timeout /t 2 >nul

echo -------------------------
echo 🌐 Starting FRONTEND...
echo -------------------------
start cmd /k "cd frontend && npm run dev"

echo -------------------------
echo ✔ All systems running!
echo -------------------------
pause
