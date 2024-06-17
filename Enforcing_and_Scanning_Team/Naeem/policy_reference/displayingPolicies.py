# this script displays policies based off the setup.inf with reference to the reference file
import csv
import sys 
device_policy_csv = sys.argv[1]
reference = sys.argv[2]

data_dict = {}

with open(device_policy_csv, mode='r', newline='', encoding='utf-8') as csv_file:
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
#                 print("-" * 40 + str(counter))
#             found = True
#             break

#     # if found:
#     #     break

#     if not found:
#         entry = (ref_key, "Not Set", ref_value)
#         if entry not in unique_entries:
#             unique_entries.add(entry)
#             counter+=1
#             print(f"Policy name: {ref_key}")
#             print(f"Value: Not Set")
#             print(f"ConstantName: {ref_value}")
#             print("-" * 40 + str(counter))
# Process the data
counter = 0
unique_entries = set()

# Iterate through the reference dictionary to ensure all policies are checked
for ref_key, ref_value in reference_dict.items():
    found = False
    for key, value in data_dict.items():
        if key == ref_value:
            entry = (ref_key, value, key)
            if entry not in unique_entries:
                unique_entries.add(entry)
                counter += 1
                print(f"Policy name: {ref_key}")
                print(f"Value: {value}")
                print(f"ConstantName: {key}")
                print("-" * 40 + str(counter))
            found = True
            break

    # If not found in data_dict, add as "Not Set"
    if not found:
        entry = (ref_key, "Not Set", ref_value)
        if entry not in unique_entries:
            unique_entries.add(entry)
            counter += 1
            print(f"Policy name: {ref_key}")
            print(f"Value: Not Set")
            print(f"ConstantName: {ref_value}")
            print("-" * 40 + str(counter))
        
