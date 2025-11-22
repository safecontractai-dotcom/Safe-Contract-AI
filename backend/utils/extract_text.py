import pdfplumber
import docx
import re
import os

def extract_text(file_path):
    """Extract text from PDF, DOCX, or TXT"""

    ext = file_path.split(".")[-1].lower()

    if ext == "pdf":
        return extract_from_pdf(file_path)

    elif ext == "docx":
        return extract_from_docx(file_path)

    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return clean_text(f.read())

    else:
        return None


# -------------------------------
# PDF Extraction
# -------------------------------
def extract_from_pdf(path):
    try:
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text += page_text + "\n"
        return clean_text(text)
    except Exception as e:
        print("PDF extraction error:", e)
        return ""


# -------------------------------
# DOCX Extraction
# -------------------------------
def extract_from_docx(path):
    try:
        doc = docx.Document(path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return clean_text(text)
    except Exception as e:
        print("DOCX extraction error:", e)
        return ""


# -------------------------------
# CLEANING
# -------------------------------
def clean_text(text):
    """Normalize and clean extracted text"""

    if not text:
        return ""

    # Remove multiple line breaks
    text = re.sub(r"\n\s*\n", "\n\n", text)

    # Remove extra spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove repeating symbols (----, ****, etc.)
    text = re.sub(r"[-_*]{3,}", " ", text)

    # Strip whitespace
    text = text.strip()

    return text


# -------------------------------
# CLAUSE SPLITTING
# -------------------------------
def split_into_clauses(text):
    """
    Split text into contract clauses based on patterns:
    - numbered clauses "1.", "2.1", "3.2.1"
    - section titles
    - typical contract separators
    """

    if not text:
        return []

    # Split on common clause patterns
    clauses = re.split(
        r"\n(?=\d+\.\s)|"          # 1. Clause
        r"\n(?=\d+\.\d+\s)|"        # 2.1 Clause
        r"\n(?=[A-Z][a-z]+\s?:)|"   # Titles like "Confidentiality:"
        r"\n(?=[A-Z ]{3,}\n)",      # FULL CAPS HEADINGS
        text
    )

    # Final cleanup
    cleaned_clauses = [c.strip() for c in clauses if len(c.strip()) > 20]

    return cleaned_clauses
