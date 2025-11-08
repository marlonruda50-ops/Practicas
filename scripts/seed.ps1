$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\..\backend"
node src/scripts/seed.js
