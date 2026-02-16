@echo off
echo Starting MindLink+ locally...
echo.

echo [1/3] Starting PostgreSQL (make sure it's running on port 5432)
echo.

echo [2/3] Starting Backend on port 5000...
start cmd /k "cd backend && npm start"
timeout /t 3

echo [3/3] Starting Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo MindLink+ is starting!
echo ========================================
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Database: PostgreSQL on localhost:5432
echo ========================================
echo.
echo Make sure PostgreSQL is running with:
echo   - Database: mindlink
echo   - User: postgres
echo   - Password: password
echo ========================================
