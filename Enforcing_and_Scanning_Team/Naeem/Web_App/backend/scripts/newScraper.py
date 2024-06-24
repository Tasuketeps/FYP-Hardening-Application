import PyPDF2
import re
import csv
import sys

csv_file = sys.argv[1]
# Function to check what type of policy based on it's ID

def check_policy(rule_id):
    accountPolicyPattern = r"^1(\.\d+)*$"
    userRightsPattern = r"^2.2(\.\d+)*$"
    securityOptionsPattern = r"^2.3(\.\d+)*$"
    systemServicesPattern = r"^5(\.\d+)*$"
    windowsFirewallPattern = r"^9(\.\d+)*$"
    advAuditPattern = r"^17(\.\d+)*$"
    adminCP = r"^18\.1(\.\d+)*$"
    adminLAPS = r"^18\.2(\.\d+)*$"
    MSGuide = r"^18\.3(\.\d+)*$"
    # check if it's account policy
    reAccountPolicy = re.search(accountPolicyPattern,rule_id,re.DOTALL)
    reUserRights = re.search(userRightsPattern,rule_id,re.DOTALL)
    reSecurityOptions = re.search(securityOptionsPattern,rule_id,re.DOTALL)
    reSystemServices = re.search(systemServicesPattern,rule_id,re.DOTALL)
    reWindowsFirewall = re.search(windowsFirewallPattern,rule_id,re.DOTALL)
    reAdvAudit = re.search(advAuditPattern,rule_id,re.DOTALL)
    reAdminCP = re.search(adminCP,rule_id,re.DOTALL)
    reAdminLAPS = re.search(adminLAPS,rule_id,re.DOTALL)
    reMSGuide = re.search(MSGuide,rule_id,re.DOTALL)


    if reAccountPolicy is not None:
        return "Account Policies"
    if reUserRights is not None:
        return "User Rights Assignments"
    if reSecurityOptions is not None:
        return "Security Options"
    if reSystemServices is not None:
        return "System Services"
    if reWindowsFirewall is not None:
        return "Windows Firewall"
    if reAdvAudit is not None:
        return "Advanced Audit Policy Configuration"
    if reAdminCP is not None:
        return "Administrative Templates: Control Panel"
    if reAdminLAPS is not None:
        return "Administrative Templates: LAPS"
    if reMSGuide is not None:
        return "MS Security Guide"
    else:
        return "Blank"
    

# Open the PDF file
with open(csv_file, 'rb') as pdf_file:
    # Create a PDF reader object
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    # Get the number of pages in the PDF
    num_pages = len(pdf_reader.pages)
    
    # Get the CIS Benchmark Title from Cover Page
    coverPageText = pdf_reader.pages[0].extract_text()
    def get_text(input_text):
        pattern = "(?<=CIS).*(?=Benchmark)"
        rerule = re.search(pattern, coverPageText, re.DOTALL)
        if rerule is not None:
            CISName = rerule.group(0).strip().replace('\n','')
            if "Microsoft Windows 11 Enterprise" in CISName:
                return CISName
            if "Microsoft Windows Server 2019" in CISName:
                return CISName
            else:
                raise ValueError("Could not find a matching regex for {}".format(CISName))

    
    cis_version = get_text(coverPageText)
    filename = cis_version.replace(" ","_")
    filename = filename + ".csv"
    # Find where the recommendations start
    keyword = pattern = r"Recommendations\s+1 Account Policies\s+This section contains recommendations for account policies.\s+1.1 Password Policy\s+This section contains recommendations for password policy."
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            first_page = page_num
        # if keyword in text:
        #     first_page = page_num
        #     print("First page found!")

    
    # Pattern for microsoft windows 11 enterprise L1 only
    cis_pattern = r'(\d+(?:\.\d+)+)\s\(((L1))\)(.*?)(\(Automated\)|\(Manual\))'
    audit_pattern = r"Audit:(.*?)(?=Remediation:)"
    rem_pattern = r'Remediation:(.*?)(?=Default Value:)'
    rec_pattern = r"The recommended state for this setting is(.*?)((?=Note:)|(?=Rationale:))"
    pattern = r"(\d+\.\d+(?:\.\d+){0,4})\s+'([^']+)'\s+is set to\s+'([^']+)'"


    with open('benchmarks/csv/' + filename, 'w') as out_file:
        print(filename)
        rule_writer = csv.writer(
            out_file, delimiter=",", quotechar='"', quoting=csv.QUOTE_MINIMAL
        )
        rule_writer.writerow(
            [
                "ID",
                "Category",
                "Setting",
                "RecommendedValue"
                # "Audit",
                # "Remediation"
            ]
        )

        # Read through all pages
        for page in (range(first_page,num_pages)):
            data = pdf_reader.pages[page]
            data= data.extract_text()

            # Look for a rule
            rule_count = 0
            value_count = 0
            rerule = re.search(cis_pattern,data,re.DOTALL)
            if rerule is not None:
                rule = rerule.group()
                rule = rule.replace('\n','')
                rule = rule.replace('(L1) Ensure','')
                match = re.search(pattern, rule)
                if match:
                    # Extract the components
                    id_ = match.group(1)
                    setting = match.group(2)
                    value = match.group(3)
                    value_count+=1
                else:
                    id_ = 'Not found'
                    setting = 'Not found'
                    value = 'Not found'
                rule_count += 1
                
                # print(rule)


            # Look for audit section
            aud_count = 0
            reaudit = re.search(audit_pattern,data,re.DOTALL)
            if reaudit is not None:
                aud_count = 1
                audit = reaudit.group()
                audit = audit.replace("\n", " ")
                audit = ' '.join(audit.split())
                audit = audit.replace("Navigate to the UI Path articulated in the Remediation section and confirm it is set as prescribed. This group policy setting is backed by the following registry location with a "," ")
                # print(audit)

            # Look for remediation
            rem_count = 0
            rerem = re.search(rem_pattern,data,re.DOTALL)
            if rerem is not None:
                rem_count = 1
                rem = rerem.group()
                rem = rem.replace('To establish the recommended configuration via GP, set the following UI path to', '')
                rem = rem.strip('\n')

            if (rule_count == 1 and value_count == 1):
                # print(rule)
                if (aud_count == 0):
                    # print(audit)
                    audit = ('No audit')

                if (rem_count == 0):
                    rem = ('No rem')
                
                row = [id_,check_policy(id_),setting,value]
                rule_writer.writerow(row)
                    



    

    







