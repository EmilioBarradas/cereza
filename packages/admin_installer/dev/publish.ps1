param ( $tag )

if ([string]::IsNullOrEmpty($tag)) {
    throw "No tag specified."
}

$ls = aws s3 ls s3://cereza-admin/releases/$tag

if (![string]::IsNullOrEmpty($ls)) {
    throw "A release with that tag already exists."
}

$SRC_DIR = "$PSScriptRoot/../src"

$winTag = Get-Content $SRC_DIR/install.ps1
$winTag[0] = '$TAG = "' + $tag + '"'
($winTag -join "`n") + "`n" | Set-Content -NoNewline $SRC_DIR/install.ps1

$shTag = Get-Content $SRC_DIR/install.sh
$shTag[2] = 'TAG="' + $tag + '"'
($shTag -join "`n") + "`n" | Set-Content -NoNewline $SRC_DIR/install.sh

aws s3 sync $SRC_DIR s3://cereza-admin/releases/$tag --delete
