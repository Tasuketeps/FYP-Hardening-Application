

def get_security_policies():
    try:
        # Open the registry key containing security policies
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System") as security_key:
            # Enumerate values (individual security policies)
            for i in range(winreg.QueryInfoKey(security_key)[1]):
                policy_name, policy_value, _ = winreg.EnumValue(security_key, i)
                print(f"{policy_name}: {policy_value}")

    except Exception as e:
        print("Error:", e)
        print("Failed to retrieve security policies.")

if __name__ == "__main__":
    get_security_policies()
