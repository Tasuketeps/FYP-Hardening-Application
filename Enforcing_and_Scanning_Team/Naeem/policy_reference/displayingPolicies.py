import csv

data_dict = {}

with open('output.csv', mode='r', newline='', encoding='utf-8') as csv_file:
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
with open('policy_reference.csv', mode='r', newline='', encoding='utf-8') as csv_file:
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


# this prints out the setup.inf or the scanned data with pretty names 
counter = 0
for key, value in zip(data_dict.keys(), data_dict.values()):
    for ref_key, ref_value in zip(reference_dict.keys(), reference_dict.values()):
        if key == ref_value:
            counter+=1
            print(f"Policy name: {ref_key}")
            print(f"Value: {value}")
            print(f"ConstantName: {key}")
            print("-" * 40 + str(counter))
