#!/usr/bin/expect -f

set timeout -1
set password "password123"

spawn sudo arp-scan -l
expect {
    "*assword" {
        send "$password\r"
        exp_continue
    }
    expect eof
}

