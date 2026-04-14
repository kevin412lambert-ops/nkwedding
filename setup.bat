@echo off
echo Setting up git repository...
git config --global --add safe.directory D:/WeddingWeb/weddingweb
git config --global user.name "Kevin Lambert"
git config --global user.email "Kevin412lambert@gmail.com"
git config --global core.autocrlf true
git init
git remote remove staging 2>nul
git remote remove prod 2>nul
git remote add staging https://github.com/kevin412lambert-ops/nkweddingstage.git
git remote add prod https://github.com/kevin412lambert-ops/nkwedding.git
echo.
echo Git remotes configured:
git remote -v
echo.
echo Setup complete! You can now use push-staging.bat and push-prod.bat.
pause
