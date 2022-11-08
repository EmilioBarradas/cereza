$null = docker compose -f "$PSScriptRoot/docker-compose.yml" up -d
Write-Output "Started services."
