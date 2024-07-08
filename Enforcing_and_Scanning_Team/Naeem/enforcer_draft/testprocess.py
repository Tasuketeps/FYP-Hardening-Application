import re

def extract_first_number(value):
    # Regular expression pattern to match the first number in the string
    pattern = r'\b(\d+)\b'
    match = re.search(pattern, value)  # Search for the pattern in the string

    if match:
        return int(match.group(1))  # Convert matched number to integer
    else:
        return None  # Return None if no number found

# Examples
values = [
    "24 or more password(s)",
    "365 or fewer days, but not 0",
    "1 or more day(s)",
    "14 or more character(s)"
]

for value in values:
    number = extract_first_number(value)
    print(f"Original: {value}")
    print(f"Extracted number: {number}\n")
