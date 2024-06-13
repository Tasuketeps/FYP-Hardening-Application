import csv

# List of encodings to try
encodings = ['utf-8', 'latin1', 'utf-16']

# Initialize an empty list to store dictionaries
data_list = []

# Try opening the CSV file with different encodingscls
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

# Print the list of dictionaries
# print(data_list)

# Iterate through each dictionary and print the contents
for row_dict in data_list:
    print("Row Data:")
    for key, value in row_dict.items():
        print(f"{key}: {value}")
    print("-" * 40)
