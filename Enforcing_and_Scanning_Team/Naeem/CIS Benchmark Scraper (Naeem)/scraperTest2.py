import PyPDF2
import re


# Open the PDF file
with open('sampleBenchmark.pdf', 'rb') as pdf_file:
    # Create a PDF reader object
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    # Get the number of pages in the PDF
    num_pages = len(pdf_reader.pages)
    print(f"Number of pages: {num_pages}")

    # # Read each page
    # for page_num in range(num_pages):
    #     page = pdf_reader.pages[page_num]
    #     text = page.extract_text()
    #     print(f"Page {page_num + 1}:\n{text}\n")
    coverPageText = pdf_reader.pages[0].extract_text()
    print(coverPageText)


