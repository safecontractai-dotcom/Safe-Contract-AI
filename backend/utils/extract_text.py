import pdfplumber
import docx
import re
import os
import hashlib
from PIL import Image


# Cache folder for OCR results
OCR_CACHE_DIR = "ocr_cache"
os.makedirs(OCR_CACHE_DIR, exist_ok=True)


def extract_text(file_path):
    """Extract text from PDF, DOCX, TXT or IMAGE using optimized OCR"""

    ext = file_path.split(".")[-1].lower()

    if ext == "pdf":
        return extract_from_pdf(file_path)

    elif ext == "docx":
        return extract_from_docx(file_path)

    elif ext in ["jpg", "jpeg", "png", "webp"]:
        return extract_from_image_ocr(file_path)

    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return clean_text(f.read())

    return ""


# -------------------------------
# PDF EXTRACTION
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
# DOCX EXTRACTION
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
# ✅ ADVANCED IMAGE OCR SYSTEM
# -------------------------------
def extract_from_image_ocr(path):
    try:
        # Generate unique hash for caching
        file_hash = hashlib.md5(path.encode()).hexdigest()
        cache_file = os.path.join(OCR_CACHE_DIR, file_hash + ".txt")

        # ✅ If already OCR'd, read cache
        if os.path.exists(cache_file):
            with open(cache_file, "r", encoding="utf-8") as f:
                return clean_text(f.read())

        # ✅ Preprocess image for OCR accuracy
        image = Image.open(path).convert("L")  # grayscale
        image = image.resize((image.width * 2, image.height * 2))

        temp_path = path + "_processed.png"
        image.save(temp_path)

        # ✅ Lazy import OCR (prevents RAM crash)
        import easyocr

        reader = easyocr.Reader(
            ['en'],
            gpu=False,
            model_storage_directory="/tmp",
            download_enabled=True
        )

        result = reader.readtext(temp_path)
        extracted_text = " ".join([r[1] for r in result])

        final_text = clean_text(extracted_text)

        # ✅ Save cache
        with open(cache_file, "w", encoding="utf-8") as f:
            f.write(final_text)

        return final_text

    except Exception as e:
        print("OCR Error:", e)
        return ""


# -------------------------------
# CLEAN TEXT
# -------------------------------
def clean_text(text):
    if not text:
        return ""

    text = re.sub(r"\n\s*\n", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"[-_*]{3,}", " ", text)
    return text.strip()


# -------------------------------
# CLAUSE SPLITTER
# -------------------------------
def split_into_clauses(text):
    if not text:
        return []

    clauses = re.split(
        r"\n(?=\d+\.\s)|"
        r"\n(?=\d+\.\d+\s)|"
        r"\n(?=[A-Z][a-z]+\s?:)|"
        r"\n(?=[A-Z ]{3,}\n)",
        text
    )

    return [c.strip() for c in clauses if len(c.strip()) > 20]
