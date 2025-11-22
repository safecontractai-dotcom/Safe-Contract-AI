import traceback
import io
import os
import re
import requests
from PIL import Image
from docx import Document
from pypdf import PdfReader
from fastapi import UploadFile

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")  # ✅ Add this to Render env


# ================= MAIN ROUTER =================

def extract_text_from_file(file: UploadFile):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file.file)

    elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        return extract_text_from_image_ocr_space(file.file)

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

        # If scanned PDF -> OCR.Space fallback
        file_stream.seek(0)
        return extract_pdf_with_ocr_space(file_stream)

    except Exception:
        file_stream.seek(0)
        return extract_pdf_with_ocr_space(file_stream)


def extract_pdf_with_ocr_space(file_stream):
    try:
        return send_to_ocr_space(file_stream, is_pdf=True)
    except Exception:
        traceback.print_exc()
        return ""


# ================= IMAGE OCR (OCR.Space) =================

def extract_text_from_image_ocr_space(file_stream):
    try:
        return send_to_ocr_space(file_stream)
    except Exception:
        traceback.print_exc()
        return ""


# ================= OCR SPACE CORE =================

def send_to_ocr_space(file_stream, is_pdf=False):
    try:
        url = "https://api.ocr.space/parse/image"

        payload = {
            "isOverlayRequired": False,
            "OCREngine": 2,
            "scale": True,
            "isCreateSearchablePdf": False,
            "language": "eng"
        }

        files = {
            "file": file_stream
        }

        headers = {
            "apikey": OCR_SPACE_API_KEY
        }

        response = requests.post(url, data=payload, files=files, headers=headers, timeout=60)
        result = response.json()

        if result.get("IsErroredOnProcessing"):
            print("OCR SPACE ERROR:", result.get("ErrorMessage"))
            return ""

        parsed = result.get("ParsedResults")
        if not parsed:
            return ""

        extracted_text = parsed[0].get("ParsedText", "")
        return clean_text(extracted_text)

    except Exception as e:
        print("OCR.Space Exception:", e)
        return ""


# ================= DOCX HANDLER =================

def extract_text_from_docx(file_stream):
    try:
        return "\n".join([p.text for p in Document(file_stream).paragraphs])
    except Exception:
        traceback.print_exc()
        return ""


# ================= TXT HANDLER =================

def extract_text_from_txt(file_stream):
    try:
        return file_stream.read().decode("utf-8", errors="ignore")
    except Exception:
        traceback.print_exc()
        return ""


# ================= CLEANER =================

def clean_text(text):
    if not text:
        return ""

    text = re.sub(r"\n\s*\n", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"[-_*]{3,}", " ", text)

    return text.strip()
