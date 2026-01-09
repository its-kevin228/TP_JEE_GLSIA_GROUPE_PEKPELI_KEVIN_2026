@echo off
echo ========================================
echo    EGA BANK - Demarrage Application
echo ========================================
echo.

REM Verification Java
echo [1/4] Verification de Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Java n'est pas installe ou n'est pas dans le PATH
    echo Telechargez Java 21 depuis: https://adoptium.net/
    pause
    exit /b 1
)
echo Java OK!
echo.

REM Verification Node.js
echo [2/4] Verification de Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Telechargez Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js OK!
echo.

REM Demarrage Backend
echo [3/4] Demarrage du Backend Spring Boot...
echo Port: 8080
echo.
start "EGA Bank Backend" cmd /k "cd ega-bank && mvnw.cmd spring-boot:run"

REM Attendre que le backend demarre
echo Attente du demarrage du backend (30 secondes)...
timeout /t 30 /nobreak >nul

REM Installation et demarrage Frontend
echo [4/4] Demarrage du Frontend Angular...
echo Port: 4200
echo.

cd ega-bank-frontend

REM Verifier si node_modules existe
if not exist "node_modules\" (
    echo Installation des dependances npm...
    call npm install
)

start "EGA Bank Frontend" cmd /k "npm start"

echo.
echo ========================================
echo    Demarrage termine!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:4200
echo.
echo Deux fenetres de terminal ont ete ouvertes.
echo NE LES FERMEZ PAS pendant l'utilisation.
echo.
echo Ouvrez votre navigateur et allez sur:
echo http://localhost:4200
echo.
echo Pour arreter l'application:
echo - Appuyez sur Ctrl+C dans chaque fenetre
echo - Ou fermez les fenetres de terminal
echo.
pause
