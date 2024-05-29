import re
id_ = "1.2.2"

# Function to check what type of policy based on it's ID

def check_policy(rule_id):
    accountPolicyPattern = r"^1(\.\d+)*$"
    # check if it's account policy
    reid = re.search(accountPolicyPattern,rule_id,re.DOTALL)
    if reid is not None:
        return "Account Policies","secedit"
    else:
        "Blank"


category, method = check_policy(id_)
print(category)
print(method)