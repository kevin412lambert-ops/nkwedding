@echo off
echo WARNING: You are about to push to PRODUCTION.
set /p confirm="Are you sure? (yes/no): "
if /i "%confirm%" NEQ "yes" (
    echo Cancelled.
    pause
    exit /b
)
echo Pushing to PRODUCTION...
git add .
git commit -m "prod update: %date% %time%"
git push prod HEAD:main
echo Done! Production site will update shortly.
pause
