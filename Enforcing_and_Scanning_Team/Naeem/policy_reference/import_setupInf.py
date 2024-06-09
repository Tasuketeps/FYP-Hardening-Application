import re
import csv
inf_file_path = 'setup.inf'

sid = {
        "*S-1-1-0": "Everyone",
        "*S-1-5-19": "LOCAL SERVICE",
        "*S-1-5-20": "NETWORK SERVICE",
        "*S-1-5-32-544": "Administrators",
        "*S-1-5-32-545": "Users",
        "*S-1-5-32-551": "Backup Operators"
    }

# Open the .inf file and read its contents as binary
with open(inf_file_path, 'rb') as inf_file:
    inf_contents_binary = inf_file.read()

# Try decoding the binary data using UTF-16 encoding
try:
    inf_contents_text = inf_contents_binary.decode('utf-16')
except UnicodeDecodeError:
    # If UTF-16 decoding fails, try UTF-8 as a fallback
    inf_contents_text = inf_contents_binary.decode('utf-8', errors='replace')

policy_dict = {}

for line in inf_contents_text.splitlines():
    if line.strip() and '=' in line:
        # Split the line into key and value
        key, value = line.strip().split('=')
        # Remove extra spaces around the key
        key = key.strip()
        # Store the policy and value in the dictionary
        policy_dict[key] = value.strip()


# Specify the CSV file path
csv_file = 'output.csv'

# Write the dictionary to CSV
with open(csv_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Policy Constant Name', 'Current Value'])
    for key, value in policy_dict.items():
        writer.writerow([key.strip(), value.strip()])

print(f'CSV file "{csv_file}" has been created.')