@echo off
cd /d F:\AetherX_Bot
node bot.js

REM Delay for 5 minutes after the initial startup
timeout /t 60 /nobreak

:loop
echo Starting bot...

REM
node bot.js

REM
if errorlevel 1 (
    echo Bot failed to start. Waiting for 5 minutes before retrying...
    timeout /t 300 /nobreak >nul
    goto loop
)

REM
for /f "tokens=2 delims==" %%A in ('powershell -command "$now = Get-Date; $nextRestart = if ($now.Hour -lt 12) { $now.Date.AddHours(12) } else { $now.Date.AddDays(1) }; $nextRestart = $nextRestart.AddHours($now.Hour -lt 12 ? 0 : -12); ($nextRestart - $now).TotalSeconds"') do set /A waitSeconds=%%A

REM
timeout /t %waitSeconds% /nobreak >nul 2>&1

REM
goto loop