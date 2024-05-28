import PyPDF2
import re


# Open the PDF file
with open('sampleBenchmark.pdf', 'rb') as pdf_file:
    # Create a PDF reader object
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    # Get the number of pages in the PDF
    num_pages = len(pdf_reader.pages)
    print(f"Number of pages: {num_pages}")

    
    # Get the CIS Benchmark Title from Cover Page
    coverPageText = pdf_reader.pages[0].extract_text()
    def get_text(input_text):
        # Remove extra spaces, newlines, and hyphens
        cleaned_text = re.sub(r"[\s-]+", " ", input_text.strip())
        
        # Extract the desired text using regex
        match = re.search(r"(Microsoft\s+Windows\s+11\s+Enterprise)", cleaned_text)
        if match:
            return match.group(1)
        else:
            return None
    
    cis_version = get_text(coverPageText)


    # Find where the recommendations start
    keyword = 'Recommendations'
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        if keyword in text:
            first_page = page_num

    
    # Pattern for microsoft windows 11 enterprise
    cis_pattern = '(\d+(?:\.\d+)+)\s\(((L[12])|(NG)|(BL))\)(.*?)(\(Automated\)|\(Manual\))'
    audit_pattern = "Audit:(.*?)(?=Remediation:)"
    rem_pattern = 'Remediation:(.*?)(?=Default Value:)'

    # Read through all pages
    for page in (range(first_page,num_pages)):
        data = pdf_reader.pages[page]
        data= data.extract_text()
        rerule = re.search(cis_pattern,data,re.DOTALL)
        if rerule is not None:
            rule = rerule.group()
            rule = rule.replace('\n','')
            print(rule)

        reaudit = re.search(audit_pattern,data,re.DOTALL)
        if reaudit is not None:
            audit = reaudit.group()
            audit = audit.replace("\n", " ")
            audit = ' '.join(audit.split())
            audit = audit.replace(" Navigate to the UI Path articulated in the Remediation section and confirm it is set as prescribed. This group policy setting is backed by the following registry location with a "," ")
            print(audit)

        rerem = re.search(rem_pattern,data,re.DOTALL)
        if rerem is not None:
            rem = rerem.group()
            rem = rem.replace('To establish the recommended configuration via GP, set the following UI path to', '')
            rem = rem.strip('\n')

            
            print(rem)







