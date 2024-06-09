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

encodings = ['utf-8', 'latin1', 'utf-16']

# Initialize an empty list to store dictionaries
data_list = []

# Try opening the CSV file with different encodings
for encoding in encodings:
    try:
        with open('cis_benchmark.csv', mode='r', newline='', encoding=encoding) as csv_file:
            csv_reader = csv.reader(csv_file)
            headers = next(csv_reader)  # Read the headers

            # Iterate over each row in the CSV
            for row in csv_reader:
                # Check if the row is empty (contains only empty strings)
                if not all(cell == '' for cell in row):
                    # Create a dictionary for the current row with quotes and newlines removed
                    row_dict = {
                        header.replace('"', '').replace("'", ""): value.replace('"', '').replace("'", "").replace("\r\n", "")
                        for header, value in zip(headers, row)
                    }
                    # Append the dictionary to the list
                    data_list.append(row_dict)

        # If no UnicodeDecodeError occurred and data is recorded, break the loop
        if data_list:
            break
    except UnicodeDecodeError:
        print(f"Error decoding CSV file with encoding: {encoding}")



counter = 0
unique_entries = set()  # To keep track of unique entries


sid = {
        "*S-1-1-0": "Everyone",
        "*S-1-5-19": "LOCAL SERVICE",
        "*S-1-5-20": "NETWORK SERVICE",
        "*S-1-5-32-544": "Administrators",
        "*S-1-5-32-545": "Users",
        "*S-1-5-32-551": "Backup Operators",
        "*S-1-5-6": "Service",
        "*S-1-5-80-3139157870-2983391045-3678747466-658725712-1809340420": "NT SERVICE\\WdiServiceHost"
    }

# loop through the client policies 
# for key, value in data_dict.items():

#     # loop through the reference sheet for policy constant names
#     for ref_key, ref_value in reference_dict.items():

#         # check if the policy data matches the constant name
#         if key == ref_value:
#             for row_dict in data_list:
#                 if row_dict["Setting"] == ref_key:
#                     entry = (ref_key, value, row_dict["RecommendedValue"])
#                     if entry not in unique_entries:  # Check if entry is unique
#                         unique_entries.add(entry)  # Add to set of unique entries
#                         counter += 1
#                         print("Row Data:")
#                         rec_value = row_dict["RecommendedValue"]
#                         print("-" * 40)
#                         print(f"Policy name: {ref_key}")
#                         print(f"Value: {value}")
#                         print(f"Recommended Value: {rec_value}")
#                         print(f"ConstantName: {key}")
#                         print("-" * 40 + str(counter))

for key, value in data_dict.items():
    # Split the value by comma to handle multiple SIDs
    values = value.split(',')
    
    # Replace SIDs with corresponding names
    converted_values = [sid.get(v, v) for v in values]
    
    # Join the converted values back into a single string
    converted_value = ','.join(converted_values)
    
    for ref_key, ref_value in reference_dict.items():
        if key == ref_value:
            for row_dict in data_list:
                if row_dict["Setting"] == ref_key:
                    entry = (ref_key, converted_value, row_dict["RecommendedValue"])
                    if entry not in unique_entries:  # Check if entry is unique
                        unique_entries.add(entry)  # Add to set of unique entries
                        counter += 1
                        print("Row Data:")
                        rec_value = row_dict["RecommendedValue"]
                        print("-" * 40)
                        print(f"Policy name: {ref_key}")
                        print(f"Value: {converted_value}")
                        print(f"Recommended Value: {rec_value}")
                        print(f"ConstantName: {key}")
                        print("-" * 40 + str(counter))

