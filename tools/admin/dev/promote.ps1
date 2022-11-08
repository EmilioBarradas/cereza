param ( $tag )

if ([string]::IsNullOrEmpty($tag)) {
    throw "No tag specified."
}

aws s3 cp s3://cereza-admin/releases/$tag/install.ps1 s3://cereza-admin
aws s3 cp s3://cereza-admin/releases/$tag/install.sh s3://cereza-admin
