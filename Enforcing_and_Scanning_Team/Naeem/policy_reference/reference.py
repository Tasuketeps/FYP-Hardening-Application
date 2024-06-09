import csv

# Initialize an empty dictionary
data_dict = {}

# Open the CSV file
with open('policy_reference.csv', mode='r', newline='', encoding='utf-8') as csv_file:
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
print(data_dict)
