#!/bin/sh

$VERSION="{{version}}"

BUCKET_URL="https://get.cereza.dev/releases/$VERSION"
INSTALL_DIR="$HOME/.cereza/cli"

mkdir -r $INSTALL_DIR

curl -s "$BUCKET_URL/$TARGET-$ARCH-$BIT.tar.gz" | tar -x "$INSTALL_DIR"
