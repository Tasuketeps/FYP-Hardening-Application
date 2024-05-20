# Define the paths
$infPath = "C:\school\SecurityPolicies.inf"
$csvPath = "C:\school\SecurityPolicies.csv"


# Export the local security policy to an INF file
secedit /export /cfg $infPath

# Initialize an array to hold the policy data
$policies = @()

# Read the INF file and parse its content
$infContent = Get-Content -Path $infPath
foreach ($line in $infContent) {
    # Skip lines that are comments or section headers
    if ($line -match "^\s*;") { continue }
    if ($line -match "^\s*\[") { continue }
    if ($line -match "^\s*$") { continue }

    # Parse the policy name and value
    $parts = $line -split("=")
    if ($parts.Count -eq 2) {
        $policyName = $parts[0].Trim()
        $policyValue = $parts[1].Trim()
        $policies += [PSCustomObject]@{
            Name  = $policyName
            Value = $policyValue
        }
    }
}

# Export the policies to a CSV file
$policies | Export-Csv -Path $csvPath -NoTypeInformation

Write-Output "Local security policies have been exported to $csvPath"
