
def get_password_policy():
    policies = {
        "MaximumPasswordAge": 120, 
        "MinimumPasswordAge": 5, # Minimum number of days a password must be used before it can be changed.
        "MinimumPasswordLength": 10, # Minimum number of characters required for a password
        "PasswordComplexity": 1, # Enable(1) or Disable(0) password complexity requirements
        "PasswordHistorySize": 5 # number of previous passwords that cannot be reused
    }

    registry_path = r"SYSTEM\CurrentControlSet\Services\Netlogon\Parameters"
    
    try:
        # Open the registry key
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, registry_path) as key:
            for policy in policies:
                try:
                    # Query the value for each policy
                    value, _ = winreg.QueryValueEx(key, policy)
                    policies[policy] = value
                except FileNotFoundError:
                    policies[policy] = "Policy not set"

        return policies

    except FileNotFoundError:
        print("Could not open registry path. Please ensure you have the correct permissions.")
        return None

if __name__ == "__main__":
    policy_values = get_password_policy()
    if policy_values:
        for policy, value in policy_values.items():
            print(f"{policy}: {value}")
