import traceback
import io
import numpy as np
import fitz
from PIL import Image
from docx import Document
from pypdf import PdfReader
from fastapi import UploadFile
import easyocr

# ---------------- EasyOCR Init ----------------
print("[INFO] Initializing EasyOCR reader...")
reader = easyocr.Reader(['en'])


# ---------------- Core Router ----------------
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


# ---------------- PDF Handler ----------------
def extract_text_from_pdf(file_stream):
    try:
        reader_pdf = PdfReader(file_stream)
        text = "".join([page.extract_text() or "" for page in reader_pdf.pages])
        if text.strip():
            return text
        file_stream.seek(0)
        return extract_text_with_easyocr(file_stream)
    except Exception:
        file_stream.seek(0)
        return extract_text_with_easyocr(file_stream)


def extract_text_with_easyocr(file_stream):
    try:
        doc = fitz.open(stream=file_stream.read(), filetype="pdf")
        text = ""
        for page in doc:
            pix = page.get_pixmap(dpi=300)
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
            text += " ".join(
                [txt for (_, txt, _) in reader.readtext(np.array(img))]
            )
        return text
    except Exception:
        traceback.print_exc()
        return None


# ---------------- IMAGE OCR ----------------
def extract_text_from_image(file_stream):
    try:
        image = Image.open(file_stream).convert("RGB")
        text = " ".join([t[1] for t in reader.readtext(np.array(image))])
        return text
    except Exception:
        traceback.print_exc()
        return None


# ---------------- DOCX ----------------
def extract_text_from_docx(file_stream):
    try:
        return "\n".join(p.text for p in Document(file_stream).paragraphs)
    except Exception:
        traceback.print_exc()
        return None


# ---------------- TXT ----------------
def extract_text_from_txt(file_stream):
    try:
        return file_stream.read().decode("utf-8")
    except Exception:
        traceback.print_exc()
        return None
