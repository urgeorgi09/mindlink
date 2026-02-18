@echo off
:loop
ssh -N -R 5173:localhost:5173 -R 5174:localhost:5174 -R 5175:localhost:5175 root@95.111.253.252
timeout /t 5 /nobreak
goto loop
