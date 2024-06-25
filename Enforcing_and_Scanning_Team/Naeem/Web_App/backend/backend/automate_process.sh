#!/bin/bash

# Define variables
WINDOWS_HOST="192.168.126.145"
WINDOWS_USER="SysAdmin2"
WINDOWS_PASSWORD="1qwer$#@!"
REMOTE_FILE_PATH="C:/Users/SysAdmin2/setup.inf"
LOCAL_SCAN_DIR="~/scans"
WEB_SERVER_USER="naeem"
WEB_SERVER_IP="192.168.126.148"
WEB_SERVER_PASSWORD="password123"

# Debugging: Print variables
echo "WINDOWS_HOST: $WINDOWS_HOST"
echo "WINDOWS_USER: $WINDOWS_USER"
echo "REMOTE_FILE_PATH: $REMOTE_FILE_PATH"
echo "LOCAL_SCAN_DIR: $LOCAL_SCAN_DIR"
echo "WEB_SERVER_USER: $WEB_SERVER_USER"
echo "WEB_SERVER_IP: $WEB_SERVER_IP"

HOSTNAME=$(sshpass -p '1qwer$#@!' ssh ${WINDOWS_USER}@${WINDOWS_HOST} hostname)

CLEAN_HOSTNAME=$(echo "${HOSTNAME}" | tr -d '\r')

# Get the current date and time in a formatted string (e.g., YYYY-MM-DD_HH-MM-SS)
CURRENT_DATE_TIME=$(date +'%Y-%m-%d_%H-%M-%S')

# Construct the filename using the cleaned hostname and current date/time
FILENAME="${CLEAN_HOSTNAME}_${CURRENT_DATE_TIME}.inf"


# Run the secedit command on the Windows client via SSH using sshpass
echo "Running secedit command on the Windows client..."
sshpass -p '1qwer$#@!' ssh ${WINDOWS_USER}@${WINDOWS_HOST} 'powershell.exe -Command "secedit /export /cfg setup.inf"'

# Transfer the file directly to the web server using sshpass
echo "Transferring file to the web server..."
sshpass -p '1qwer$#@!' scp ${WINDOWS_USER}@${WINDOWS_HOST}:setup.inf ~/scans/"${FILENAME}"

# Verify if the SCP command was successful
if [ $? -eq 0 ]; then
    echo "File transferred successfully."
else
    echo "Failed to transfer the file."
    exit 1
fi
