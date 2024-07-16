#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <WINDOWS_HOST> <SCAN_FILENAME>"
    exit 1
fi

# Define variables
WINDOWS_HOST="$1"
SCAN_FILENAME="$2"
REMOTE_FILE_PATH="C:/Users/Administrator/setup.inf"
DIR="$( cd "$( dirname "$0" )" && pwd )"
LOCAL_SCAN_DIR="$( dirname "$( dirname "$DIR" )" )"
SCAN_DIR="$LOCAL_SCAN_DIR"/backend/scans/inf

WEB_SERVER_USER="naeem"

# Debugging: Print variables
echo "WINDOWS_HOST: $WINDOWS_HOST"
echo "WINDOWS_USER: $WINDOWS_USER"
echo "REMOTE_FILE_PATH: $REMOTE_FILE_PATH"
echo "LOCAL_SCAN_DIR: $SCAN_DIR"
echo "WEB_SERVER_USER: $WEB_SERVER_USER"
echo "WEB_SERVER_IP: $WEB_SERVER_IP"

# Run the secedit command on the Windows client via SSH using sshpass
echo "Running secedit command on the Windows client..."

# Transfer the file to the Windows client
sshpass scp -o StrictHostKeyChecking=no ${SCAN_DIR}/${SCAN_FILENAME} Administrator@${WINDOWS_HOST}:new_setup.inf
if [ $? -ne 0 ]; then
    echo "Failed to transfer the file."
    exit 1
fi

# Run the secedit command on the Windows client
sshpass ssh -o StrictHostKeyChecking=no Administrator@${WINDOWS_HOST} 'secedit /configure /db C:\Windows\security\local.sdb /cfg new_setup.inf /overwrite' << EOF
y
EOF

# Verify if the secedit command was successful
if [ $? -eq 0 ]; then
    echo "Success"
else
    echo "Failed to run secedit command."
    exit 1
fi
