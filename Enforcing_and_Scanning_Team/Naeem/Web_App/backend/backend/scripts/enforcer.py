import csv
import sys
import codecs

# Define the file paths
inf_file_path = sys.argv[1]
csv_file_path = sys.argv[2]

# SID mapping dictionary
sid = {
    "*S-1-1-0": "Everyone",
    "*S-1-5-19": "LOCAL SERVICE",
    "*S-1-5-20": "NETWORK SERVICE",
    "*S-1-5-80-0": r"NT SERVICE\ALL SERVICES",
    "*S-1-5-32-544": "Administrators",
    "*S-1-5-32-555": "Remote Desktop Users",
    "*S-1-5-32-545": "Users",
    "*S-1-5-32-551": "Backup Operators",
    "*S-1-5-6": "SERVICE",
    "*S-1-5-9": "ENTERPRISE DOMAIN CONTROLLERS",
    "*S-1-5-11": "Authenticated Users",
    "*S-1-5-32-548": "Account Operators",
    "*S-1-5-32-549": "Server Operators",
    "*S-1-5-32-550": "Printer Operators",
    "*S-1-5-90-0": r"Window Manager \Window Manager Group",
    "*S-1-5-32-559": "Performance Log Users",
    "*S-1-5-80-3139157870-2983391045-3678747466-658725712-1809340420": "NT SERVICE \\WdiServiceHost",
    "*S-1-5-83-0": "NT VIRTUAL MACHINE \\Virtual Machines"
}

# Reverse SID mapping dictionary
reverse_sid = {v: k for k, v in sid.items()}

# Read the CSV file and store the data in a dictionary
csv_data = {}
with open(csv_file_path, mode='r', newline='') as csv_file:
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        if len(row) == 2:
            key, value = row
            csv_data[key.strip()] = value.strip()

# Print out the csv_data for debugging
print("CSV Data:")
for key, value in csv_data.items():
    print(f"{key}: {value}")

# Helper function to convert value to SID format if necessary
def convert_to_sid(value):
    if ',' in value:
        values = [v.strip() for v in value.split(',')]
        return ','.join(reverse_sid.get(v, v) for v in values)
    return reverse_sid.get(value, value)

# Read the .inf file and store its contents
with open(inf_file_path, 'r', encoding='utf-16') as inf_file:
    inf_contents = inf_file.readlines()

# Print out the original .inf contents for debugging
print("\nOriginal INF Contents:")
for line in inf_contents:
    print(line.strip())

# Update the .inf file contents based on the CSV data
updated_inf_contents = []
for line in inf_contents:
    if '=' in line and not line.strip().startswith('['):
        key, sep, value = line.partition('=')
        key = key.strip()
        if key in csv_data:
            new_value = csv_data[key]
            if new_value == 'No One':
                print(f"Removing line for key: {key}")  # Debugging print statement
                continue  # Skip adding this line to updated contents
            if key.startswith('Se'):
                new_value = convert_to_sid(new_value)
            line = f"{key} = {new_value}\n"
            print(f"Updated line: {line.strip()}")  # Debugging print statement
    updated_inf_contents.append(line)

# Write the updated contents back to the .inf file
with codecs.open(inf_file_path, 'w', encoding='utf-16') as inf_file:
    inf_file.writelines(updated_inf_contents)

print(f'\nValues in "{inf_file_path}" have been updated based on the CSV data.')