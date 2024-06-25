#!/bin/bash

# Check if the IP address argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <IP_ADDRESS>"
    exit 1
fi

WINDOWS_HOST="$1"
WINDOWS_USER="SysAdmin2"
WINDOWS_PASSWORD="1qwer$#@!"
LOCAL_SCAN_DIR="~/scans"
WEB_SERVER_USER="naeem"
WEB_SERVER_IP="192.168.126.148"
WEB_SERVER_PASSWORD="password123"

# SSH to the Windows host and retrieve the hostname
HOSTNAME=$(sshpass -p '1qwer$#@!' ssh ${WINDOWS_USER}@${WINDOWS_HOST} systeminfo)
CLEAN_HOSTNAME=$(echo "$HOSTNAME" | tr -d '\r')

echo "$CLEAN_HOSTNAME"
