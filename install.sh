#!/bin/bash

# Define variables
DOWNLOAD_URL="https://github.com/hugoarmor/streamify/releases/download/0.1.0/streamify.tar.gz"
INSTALL_DIR="/usr/local"

# Download tarball
echo "[INFO] Downloading Streamify..."
wget "$DOWNLOAD_URL"
echo "[INFO] Download of streamify.tar.gz completed"
echo

# Clear existing installation
echo "[INFO] Clearing existing installation..."
sudo rm -rf "$INSTALL_DIR/streamify"

# Extract tarball
echo "[INFO] Extracting Streamify..."
sudo tar -xzf streamify.tar.gz -C "$INSTALL_DIR"
echo "[INFO] Extracted to $INSTALL_DIR"
echo
# Cleanup
echo "[INFO] Cleaning up..."
rm streamify.tar.gz
echo "[INFO] Cleaned up streamify.tar.gz"
echo
echo "[INFO] Installation completed. Streamify is now ready to use."
echo "[INFO] Please add the following line into your .bashrc or .zshrc file to use Streamify:"
echo "  export PATH=\$PATH:$INSTALL_DIR/streamify/rel/streamify/bin"
echo "  export STREAMIFY_MANAGED_FOLDER=<absolute_path_to_folder>"
echo
echo "[INFO] Then run: "
echo "  $ streamify start"
