#!/bin/sh

TAG="latest"

if [ "$SUDO_USER" = "" ]
then
    echo "Error: Installation script must be ran with privileged permissions."
    exit 1
fi

USER_HOME=$(getent passwd $SUDO_USER | cut -d: -f6 | head -n 1)
INSTALL_DIR="$USER_HOME/.cereza/admin"
BINARY_DIR="/usr/local/bin"

echo ""
echo "Installing cereza_admin@$TAG."
echo ""

mkdir -p $INSTALL_DIR >/dev/null 2>&1
cp ./docker-compose.yml $INSTALL_DIR/docker-compose.yml >/dev/null 2>&1
cp ./cereza_admin.sh $INSTALL_DIR/cereza_admin.sh >/dev/null 2>&1
echo "Installed into '$INSTALL_DIR'."

ln -s $INSTALL_DIR/cereza_admin.sh /usr/local/bin/cereza_admin >/dev/null 2>&1
echo "Created symbolic link from '$INSTALL_DIR/cereza_admin.sh' to '$BINARY_DIR/cereza_admin'."

echo ""
echo "Run 'cereza_admin' to start services."
