#!/usr/bin/expect -f

set timeout -1
set password "password123"

# Execute arp-scan with sudo and enter password
spawn sudo arp-scan -l
expect {
    "*assword" {
        send "$password\r"
        exp_continue
    }
    timeout {
        puts "Timeout while waiting for password prompt"
        exit 1
    }
    eof
}

# Parse IP addresses from the arp-scan output
set arp_output $expect_out(buffer)
set ip_addresses [regexp -all -inline {(\d+\.\d+\.\d+\.\d+)} $arp_output]

# Iterate through each IP address
foreach ip $ip_addresses {
    # Check if IP address ends with .1, .2, or .254
    if {[regexp {(\.1|\.2|\.254|\.148)$} $ip]} {
        puts "Skipping IP: $ip"
    } else {
        puts "Attempting SSH to IP: $ip"
        spawn sshpass -p '1qwer$#@!' ssh sysadmin2@$ip;# Replace 'username' with your actual SSH username
    }
}

expect eof

