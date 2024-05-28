import re
inf_file_path = 'setup.inf'

# Open the .inf file and read its contents as binary
with open(inf_file_path, 'rb') as inf_file:
    inf_contents_binary = inf_file.read()

# Try decoding the binary data using UTF-16 encoding
try:
    inf_contents_text = inf_contents_binary.decode('utf-16')
except UnicodeDecodeError:
    # If UTF-16 decoding fails, try UTF-8 as a fallback
    inf_contents_text = inf_contents_binary.decode('utf-8', errors='replace')

# Split the text into lines
output_lines = inf_contents_text.strip().split('\n')

policies = '\n'.join(line.strip('\r') for line in output_lines)

# New policies string
new_policy = 'MaximumPasswordAge = 90'

# Process each new policy
for new_policy_item in new_policy.strip().split('\n'):
    # Split policy into name and value
    policy_name, new_value = new_policy_item.split('=', 1)
    policy_name = policy_name.strip()
    new_value = new_value.strip()

    # Regular expression pattern to match the policy line
    pattern = re.compile(rf'^{policy_name}\s*=\s*\d+', re.MULTILINE)

    # Check if the policy already exists
    match = pattern.search(policies)
    if match:
        # Policy exists, replace the matching policy line with the new value
        policies = pattern.sub(f'{policy_name} = {new_value}', policies)
    else:
        # Policy doesn't exist, add it to the end of the sample_policies string
        policies += f'\n{policy_name} = {new_value}'

output_inf_file_path = 'new_setup.inf'

# Write the formatted string to the .inf file
with open(output_inf_file_path, 'w') as inf_file:
    inf_file.write(policies)



