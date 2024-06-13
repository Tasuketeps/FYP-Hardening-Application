import subprocess
from scapy.all import ARP, Ether, srp

def get_computer_name(ip):
    try:
        output = subprocess.check_output(['nmblookup', '-A', ip], universal_newlines=True)
        lines = output.split('\n')
        for line in lines:
            if "<20>" in line:  # <20> indicates the computer name
                return line.split()[0]
    except subprocess.CalledProcessError:
        pass
    return "Unknown"

def scan_devices(ip_range):
    arp = ARP(pdst=ip_range)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = ether/arp

    result = srp(packet, timeout=10, verbose=False)[0]  # Increased timeout to 10 seconds

    devices = []
    for sent, received in result:
        ip = received.psrc
        mac = received.hwsrc
        computer_name = get_computer_name(ip)
        devices.append({'ip': ip, 'mac': mac, 'computer_name': computer_name})

    return devices

if __name__ == "__main__":
    ip_range = "192.168.126.0/24"  # Replace this with your local network IP range
    devices = scan_devices(ip_range)

    print("Devices connected to the network:")
    for device in devices:
        print(f"IP: {device['ip']} - MAC: {device['mac']} - Computer Name: {device['computer_name']}")
