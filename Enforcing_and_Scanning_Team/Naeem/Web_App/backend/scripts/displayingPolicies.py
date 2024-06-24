# this script displays policies based off the setup.inf with reference to the reference file
import csv
import sys 
benchmark_csv = sys.argv[1]
reference = sys.argv[2]
data_dict = {}

with open(benchmark_csv, mode='r', newline='', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file)
    
    # Iterate through the rows of the CSV
    for row in csv_reader:
        if len(row) == 2:  # Ensure there are exactly two columns
            key, value = row
            data_dict[key] = value

if data_dict:
    first_key = next(iter(data_dict))  # Get the first key
    del data_dict[first_key]  # Delete the key and its value
# Print the resulting dictionary

reference_dict = {}

# Open the CSV file
with open(reference, mode='r', newline='', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file)
    
    # Iterate through the rows of the CSV
    for row in csv_reader:
        if len(row) == 2:  # Ensure there are exactly two columns
            key, value = row
            reference_dict[key] = value

if reference_dict:
    first_key = next(iter(reference_dict))  # Get the first key
    del reference_dict[first_key]  # Delete the key and its value
# Print the resulting dictionary


# # this prints out the setup.inf or the scanned data with pretty names 
# counter = 0
# unique_entries =set()
# for key, value in zip(data_dict.keys(), data_dict.values()):
#     found = False
#     for ref_key, ref_value in zip(reference_dict.keys(), reference_dict.values()):
#         if key == ref_value:
#             entry=(ref_key,value,key)
#             if entry not in unique_entries:
#                 unique_entries.add(entry)
#                 counter+=1
#                 print(f"Policy name: {ref_key}")
#                 print(f"Value: {value}")
#                 print(f"ConstantName: {key}")
#
sid = {
    "*S-1-1-0": "Everyone",
    "*S-1-5-19": "LOCAL SERVICE",
    "*S-1-5-20": "NETWORK SERVICE",
    "*S-1-5-80-0": r"NT SERVICE\ ALL SERVICES",
    "*S-1-5-32-544": "Administrators",
    "*S-1-5-32-555": "Remote Desktop Users",
    "*S-1-5-32-545": "Users",
    "*S-1-5-32-551": "Backup Operators",
    "*S-1-5-6": "Service",
    "*S-1-5-9": "ENTERPRISE DOMAIN CONTROLLERS",
    "*S-1-5-11": "Authenticated Users",
    "*S-1-5-32-548": "Account Operators",
    "*S-1-5-32-549": "Server Operators",
    "*S-1-5-32-550": "Printer Operators",
    "*S-1-5-90-0": r"Windows Manager\Windows Manager Group",
    "*S-1-5-32-559": "Performance Log Users",
    "*S-1-5-80-3139157870-2983391045-3678747466-658725712-1809340420": "NT SERVICE\\WdiServiceHost"
}

def convert_to_sid(value):
    if ',' in value:
        values = [v.strip() for v in value.split(',')]
        return ','.join(sid.get(v, v) for v in values)
    return sid.get(value, value)

counter = 0
unique_entries = set()


# Iterate through the reference dictionary to ensure all policies are checked
print("Policy name, Value, ConstantName")
for ref_key, ref_value in reference_dict.items():
    found = False
    for key, value in data_dict.items():
        key = key.strip()
        if key == ref_value:
            entry = (ref_key, value, key)
            if entry not in unique_entries:
                if key.startswith('Se'):
                    value = convert_to_sid(value)
                unique_entries.add(entry)
                counter += 1
                print(f"{ref_key}, '{value}', {key}")
            found = True
            break

        
