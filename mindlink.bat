@echo off
echo ====================================
echo   MindLink+ Starting...
echo ====================================
echo.

REM Install Backend
echo [1/4] Installing Backend...
cd backend
call npm install express cors helmet dotenv mongoose express-rate-limit morgan compression axios
cd ..
echo.

REM Install Frontend
echo [2/4] Installing Frontend...
cd frontend
call npm install react react-dom react-router-dom @mui/material @emotion/react @emotion/styled axios framer-motion lucide-react uuid
cd ..
echo.

REM Start Backend
echo [3/4] Starting Backend...
start cmd /k "cd backend && node src/server.js"
timeout /t 2 >nul

REM Start Frontend
echo [4/4] Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo ====================================
echo   Done! Check the new windows.
echo ====================================
echo.
echo Press any key to close this window...
pause >nul
exit