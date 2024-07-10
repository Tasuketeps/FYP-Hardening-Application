#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: $0 <WINDOWS_HOST>"
    exit 1
fi
# Define variables
WINDOWS_HOST="$1"
WINDOWS_USER="SysAdmin2"
REMOTE_FILE_PATH="C:/Users/SysAdmin2/setup.inf"
DIR="$( cd "$( dirname "$0" )" && pwd )"
LOCAL_SCAN_DIR="$( dirname "$( dirname "$DIR" )" )"
SCAN_DIR="$LOCAL_SCAN_DIR"/backend/scans/inf

WEB_SERVER_USER="naeem"
WEB_SERVER_IP="192.168.126.148"
WEB_SERVER_PASSWORD="password123"

# Debugging: Print variables
echo "WINDOWS_HOST: $WINDOWS_HOST"
echo "WINDOWS_USER: $WINDOWS_USER"
echo "REMOTE_FILE_PATH: $REMOTE_FILE_PATH"
echo "LOCAL_SCAN_DIR: $SCAN_DIR"
echo "WEB_SERVER_USER: $WEB_SERVER_USER"
echo "WEB_SERVER_IP: $WEB_SERVER_IP"

HOSTNAME=$(sshpass ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=accept-new ${WINDOWS_USER}@${WINDOWS_HOST} hostname)

CLEAN_HOSTNAME=$(echo "${HOSTNAME}" | tr -d '\r')

# Get the current date and time in a formatted string (e.g., YYYY-MM-DD_HH-MM-SS)
CURRENT_DATE_TIME=$(date +'%Y-%m-%d_%H-%M-%S')

# Construct the filename using the cleaned hostname and current date/time
FILENAME="${CLEAN_HOSTNAME}_${WINDOWS_HOST}_${CURRENT_DATE_TIME}.inf"


# Run the secedit command on the Windows client via SSH using sshpass
echo "Running secedit command on the Windows client..."
sshpass ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=accept-new ${WINDOWS_USER}@${WINDOWS_HOST} 'powershell.exe -Command "secedit /export /cfg setup.inf"'

# Transfer the file directly to the web server using sshpass
echo "Transferring file to the web server..."
sshpass scp -i ~/.ssh/id_rsa -o StrictHostKeyChecking=accept-new ${WINDOWS_USER}@${WINDOWS_HOST}:setup.inf ${SCAN_DIR}/${FILENAME}

# Verify if the SCP command was successful
if [ $? -eq 0 ]; then
    echo "${FILENAME}"
else
    echo "Failed to transfer the file."
    exit 1
fi
