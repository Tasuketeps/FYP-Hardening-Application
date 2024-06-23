import csv
import sys
import codecs

# Define the file paths
inf_file_path = sys.argv[1]
csv_file_path = sys.argv[2]

# Read the CSV file and store the data in a dictionary
csv_data = {}
with open(csv_file_path, mode='r', newline='') as csv_file:
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        if len(row) == 2:
            key, value = row
            csv_data[key.strip()] = value.strip()

# Read the .inf file and store its contents
with open(inf_file_path, 'r', encoding='utf-16') as inf_file:
    inf_contents = inf_file.readlines()

# Update the .inf file contents based on the CSV data
updated_inf_contents = []
for line in inf_contents:
    if '=' in line and not line.strip().startswith('['):
        key, sep, value = line.partition('=')
        key = key.strip()
        if key in csv_data:
            line = f"{key} = {csv_data[key]}\n"
    updated_inf_contents.append(line)

# Write the updated contents back to the .inf file
with codecs.open(inf_file_path, 'w', encoding='utf-16') as inf_file:
    inf_file.writelines(updated_inf_contents)

print(f'Values in "{inf_file_path}" have been updated based on the CSV data.')
