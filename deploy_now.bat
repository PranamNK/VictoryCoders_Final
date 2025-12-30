@echo off
echo Starting Emergency Deployment for TempleVerse...
echo ==================================================
echo.
echo 1. Verifying local build...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check errors above.
    pause
    exit /b %errorlevel%
)
echo Build success.
echo.
echo 2. Deploying to Vercel (Production)...
echo You may be asked to log in or confirm project settings. 
echo Please accept the defaults (Y) if asked.
echo.
call npx vercel deploy --prod
echo.
echo ==================================================
echo Deployment process finished.
echo If successful, your live URL is shown above.
pause
