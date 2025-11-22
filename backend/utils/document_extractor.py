import traceback
import io
import numpy as np
import fitz
from PIL import Image
from docx import Document
from pypdf import PdfReader
from fastapi import UploadFile
import os
import re
import hashlib

# ================= EASYOCR LAZY LOADER =================

_reader = None

def get_reader():
    global _reader
    if _reader is None:
        print("[INFO] Lazy-loading EasyOCR reader (CPU mode)...")
        import easyocr
        _reader = easyocr.Reader(
            ['en'],
            gpu=False,                     # ✅ No GPU = low memory
            model_storage_directory="/tmp"
        )
    return _reader


# ================= MAIN ROUTER =================

def extract_text_from_file(file: UploadFile):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file.file)
    elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        return extract_text_from_image(file.file)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file.file)
    elif filename.endswith(".txt"):
        return extract_text_from_txt(file.file)
    else:
        raise Exception("Unsupported file type")


# ================= PDF HANDLER =================

def extract_text_from_pdf(file_stream):
    try:
        reader_pdf = PdfReader(file_stream)
        text = "".join([page.extract_text() or "" for page in reader_pdf.pages])

        if text.strip():
            return clean_text(text)

        # If PDF is scanned -> OCR fallback
        file_stream.seek(0)
        return extract_pdf_with_easyocr(file_stream)

    except Exception:
        file_stream.seek(0)
        return extract_pdf_with_easyocr(file_stream)


def extract_pdf_with_easyocr(file_stream):
    try:
        reader = get_reader()
        doc = fitz.open(stream=file_stream.read(), filetype="pdf")
        text = ""

        for page in doc:
            pix = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")

            text += " ".join([
                t[1] for t in reader.readtext(np.array(img))
            ])

        return clean_text(text)

    except Exception:
        traceback.print_exc()
        return ""


# ================= IMAGE OCR =================

def extract_text_from_image(file_stream):
    try:
        reader = get_reader()
        image = Image.open(file_stream).convert("RGB")

        results = reader.readtext(np.array(image))
        text = " ".join([r[1] for r in results])

        return clean_text(text)

    except Exception:
        traceback.print_exc()
        return ""


# ================= DOCX =================

def extract_text_from_docx(file_stream):
    try:
        return "\n".join([p.text for p in Document(file_stream).paragraphs])
    except Exception:
        traceback.print_exc()
        return ""


# ================= TXT =================

def extract_text_from_txt(file_stream):
    try:
        return file_stream.read().decode("utf-8", errors="ignore")
    except Exception:
        traceback.print_exc()
        return ""


# ================= CLEANING =================

def clean_text(text):
    if not text:
        return ""

    text = re.sub(r"\n\s*\n", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"[-_*]{3,}", " ", text)
    return text.strip()
