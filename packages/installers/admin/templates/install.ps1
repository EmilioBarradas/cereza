$VERSION = "{{version}}"

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

$ProgressPreference = 'SilentlyContinue'
$INSTALL_DIR = "$HOME\.cereza\admin"
$S3_URL = "https://admin.cereza.dev/releases/$VERSION"

Write-Output "
Installing cereza_admin@$VERSION.
"

$null = New-Item -ItemType Directory $INSTALL_DIR 2>$1
$null = Invoke-WebRequest "$S3_URL/docker-compose.yml" -OutFile "$INSTALL_DIR/docker-compose.yml" 2>$1
$null = Invoke-WebRequest "$S3_URL/cereza_admin.ps1" -OutFile "$INSTALL_DIR/cereza_admin.ps1" 2>$1
Write-Output "Installed into '$INSTALL_DIR'."

Add-Path $INSTALL_DIR
Write-Output "Added installation to path."

Write-Output "
Run 'cereza_admin' to start services.
You may need to restart your terminal for these changes to take effect.
"
