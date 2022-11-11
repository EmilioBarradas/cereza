$TAG = "latest"

function Test-Path {
    param ( $entry )

    ([Environment]::GetEnvironmentVariable('Path', 'User') -split ";").Where({ $_ -eq $entry }, 'First').Count -gt 0
}

function Add-Path {
    param ( $entry )

    if (!(Test-Path $entry)) {
        [Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ";$entry", 'User')
    }
}

$INSTALL_DIR = "$HOME\.cereza\admin"

Write-Output "
Installing cereza_admin@$TAG.
"

$null = New-Item -ItemType Directory $INSTALL_DIR 2>$1
$null = Copy-Item ./docker-compose.yml $INSTALL_DIR 2>$1
$null = Copy-Item ./cereza_admin.ps1 $INSTALL_DIR 2>$1
Write-Output "Installed into '$INSTALL_DIR.'"

Add-Path $INSTALL_DIR
Write-Output "Added installation to path."

Write-Output "
Run 'cereza_admin' to start services.
You may need to restart your terminal for these changes to take effect.
"
