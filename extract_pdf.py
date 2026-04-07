import pypdf
import os

pdf_path = r"C:\Users\Ayush Tripathi\Downloads\ad0e40cf-3828-43cf-a91e-8a17b2f27487-2-2-2-2-2-2-2-2.pdf"
output_path = "pdf_content.txt"

def extract_text():
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extraction successful. Saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_text()
