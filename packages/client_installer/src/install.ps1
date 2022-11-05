$TAG = ""

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
$INSTALL_DIR = "$HOME\.cereza\cli"
$S3_URL = "https://get.cereza.dev/releases/$TAG"

Write-Output "
Installing cereza@$TAG.
"

$null = New-Item -ItemType Directory $INSTALL_DIR 2>$1
$null = Invoke-WebRequest "$S3_URL/cereza-win-$ARCH.tar.gz" -OutFile "$INSTALL_DIR/cereza-win-$ARCH.tar.gz" 2>$1
# Untar the downloaded file.
# Delete the original file.
Write-Output "Installed into '$INSTALL_DIR'."

Add-Path $INSTALL_DIR
Write-Output "Added installation to path."

Write-Output "
Run 'cereza' to start.
You may need to restart your terminal for these changes to take effect.
"
