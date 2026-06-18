@echo off
title AwakerHz - server locale (lascia aperta questa finestra)
cd /d "%~dp0"
echo.
echo   AwakerHz  -  avvio del sito locale
echo   URL:  http://localhost:8123
echo.
echo   Lascia aperta questa finestra mentre navighi.
echo   Per fermare il server: chiudi questa finestra (o premi Ctrl+C).
echo.
start "" http://localhost:8123/
where py >nul 2>nul && (py -m http.server 8123) || ("%LOCALAPPDATA%\Programs\Python\Python312\python.exe" -m http.server 8123)
pause
