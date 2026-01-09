@echo off
echo ========================================
echo    EGA BANK - Arret Application
echo ========================================
echo.

echo Fermeture des processus Java (Backend)...
taskkill /FI "WINDOWTITLE eq EGA Bank Backend*" /T /F >nul 2>&1

echo Fermeture des processus Node (Frontend)...
taskkill /FI "WINDOWTITLE eq EGA Bank Frontend*" /T /F >nul 2>&1

echo.
echo ========================================
echo    Application arretee!
echo ========================================
echo.
pause
