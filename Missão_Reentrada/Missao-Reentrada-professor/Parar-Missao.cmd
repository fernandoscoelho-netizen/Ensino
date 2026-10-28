@echo off
setlocal
cd /d "%~dp0"
set "AURORA_NODE="
for /f "delims=" %%N in ('where node 2^>nul') do if not defined AURORA_NODE set "AURORA_NODE=%%N"
if not defined AURORA_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "AURORA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined AURORA_NODE (
 echo E necessario instalar Node.js 20 ou posterior. Consulta o ficheiro LEIA-ME.html.
 pause
 exit /b 1
)
"%AURORA_NODE%" tools\launch.cjs --stop
if errorlevel 1 pause
