import csv
import sys

output = sys.argv[1]
reference = sys.argv[2]

sample_data = {'Enforce password history': '1', 'Minimum password age': '1', 'Minimum password length': '1'}

reference_dict = {}
with open(reference, mode='r', newline='', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        if len(row) == 2:  # Ensure there are exactly two columns
            key, value = row
            reference_dict[key] = value

if reference_dict:
    first_key = next(iter(reference_dict))  # Get the first key
    del reference_dict[first_key]  # Delete the key and its value

# Write the data to CSV
with open(output, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Policy Name', 'NewValue'])
    for policy, value in sample_data.items():
        for name, codename in reference_dict.items():
            if policy == name:
                writer.writerow([codename, value])

print(f"Data has been saved to {output}")
