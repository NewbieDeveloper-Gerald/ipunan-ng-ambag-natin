@echo off
setlocal
cd /d "%~dp0"
echo Ambag Natin - Android APK build
node --version
call npm ci --include=dev --bin-links=true
if errorlevel 1 goto failed
call npm run check
if errorlevel 1 goto failed
call npx eas-cli@latest login
if errorlevel 1 goto failed
call npx eas-cli@latest init
if errorlevel 1 goto failed
call npm run build:android
if errorlevel 1 goto failed
echo When the cloud build finishes, open the EAS link and download the APK.
pause
exit /b 0
:failed
echo STOPPED. Copy the error text and send it for help. Do not run audit fix --force.
pause
exit /b 1
