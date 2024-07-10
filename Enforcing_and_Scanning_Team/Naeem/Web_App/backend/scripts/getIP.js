const os = require('os');

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const key of Object.keys(interfaces)) {
        for (const iface of interfaces[key]) {
            // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
}

// Example usage:
const localIP = getLocalIPAddress();
console.log('Local IP Address:', localIP);
