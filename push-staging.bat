@echo off
echo Pushing to STAGING...
git add .
git commit -m "staging update: %date% %time%"
git push staging HEAD:main
echo Done! Staging site will update shortly.
pause
