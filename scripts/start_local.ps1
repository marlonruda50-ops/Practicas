param(
  [string]$DbUrl = "postgres://postgres:postgres@localhost:5432/practicas"
)
$ErrorActionPreference = "Stop"
Write-Host "==> Preparando backend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\backend"
if (Test-Path ".env") { Remove-Item ".env" }
@" 
NODE_ENV=development
PORT=4000
DATABASE_URL=$DbUrl
JWT_SECRET=super_secreto_2025
JWT_EXPIRES_IN=1d
CORS_ORIGIN=*
"@ | Out-File -Encoding utf8 ".env"

npm install
Write-Host "==> Iniciando API en http://localhost:4000 ..." -ForegroundColor Green
npm run dev
