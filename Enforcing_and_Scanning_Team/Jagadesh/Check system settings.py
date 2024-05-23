import platform
import sys
import os
import psutil

print()

print("Processor:", platform.processor())
print("Operating System:", platform.system())
print("OS Version:", platform.release())
print("Machine Type:", platform.machine())
print("Python Version:", sys.version)
print("Computer Name:", os.getenv('COMPUTERNAME') or os.getenv('HOSTNAME'))
print("CPU Cores:", psutil.cpu_count())
print("Virtual Memory:", psutil.virtual_memory())
print("Disk Usage:", psutil.disk_usage('/'))

print()
