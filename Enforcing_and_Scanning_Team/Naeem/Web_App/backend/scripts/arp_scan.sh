#!/usr/bin/expect -f

# Set timeout to infinite
set timeout -1

# Set the password
set password "password123"

# Check if the IP address is passed as an argument
if {[llength $argv] == 0} {
    puts "Usage: $argv0 <IP_ADDRESS>"
    exit 1
}

# Get the IP address from the command-line arguments
set ip_address [lindex $argv 0]

# Run the arp-scan command with the provided IP address
spawn sudo arp-scan $ip_address
expect {
    "*assword" {
        send "$password\r"
        exp_continue
    }
    eof
}

