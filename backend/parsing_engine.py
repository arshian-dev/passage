import os
import io
import shutil
from PIL import Image
import pytesseract
import fitz  # PyMuPDF

# Automatically locate Tesseract-OCR binary on Windows or Linux
POSSIBLE_TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
]

def setup_tesseract():
    which_path = shutil.which("tesseract")
    if which_path:
        pytesseract.pytesseract.tesseract_cmd = which_path
        return True
    for path in POSSIBLE_TESSERACT_PATHS:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            return True
    return False

# Initialize on module import
TESSERACT_AVAILABLE = setup_tesseract()

def parse_image_with_ocr(image_bytes: bytes) -> str:
    """
    Extracts text from screenshot or image bytes using pytesseract.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Convert RGBA/P to RGB for clean OCR
        if image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"Image OCR error: {e}")
        return ""

def parse_pdf_document(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF document.
    Extracts embedded digital text first, and runs pytesseract OCR on scanned/image pages.
    """
    extracted_text_chunks = []
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text().strip()
            
            # If the page has little or no embedded text (scanned PDF), use OCR on rendered page pixmap
            if len(text) < 30 and TESSERACT_AVAILABLE:
                pix = page.get_pixmap(dpi=200)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                ocr_text = pytesseract.image_to_string(img).strip()
                if ocr_text:
                    extracted_text_chunks.append(f"--- Page {page_num + 1} (OCR) ---\n{ocr_text}")
                elif text:
                    extracted_text_chunks.append(f"--- Page {page_num + 1} ---\n{text}")
            else:
                extracted_text_chunks.append(f"--- Page {page_num + 1} ---\n{text}")
                
        return "\n\n".join(extracted_text_chunks).strip()
    except Exception as e:
        print(f"PDF parsing error: {e}")
        return ""

def parse_document_with_ocr(content: bytes, filename: str) -> str:
    """
    Unified entry point for extracting text from PDFs, screenshots, and images.
    """
    lower_fn = (filename or "").lower()
    
    if lower_fn.endswith('.pdf'):
        parsed = parse_pdf_document(content)
        if parsed:
            return parsed
        # Fallback to image OCR if fitz fails
        return parse_image_with_ocr(content)
        
    elif lower_fn.endswith(('.png', '.jpg', '.jpeg', '.webp', '.tiff', '.bmp')):
        return parse_image_with_ocr(content)
        
    elif lower_fn.endswith(('.txt', '.md', '.csv', '.json')):
        try:
            return content.decode('utf-8', errors='ignore')
        except Exception:
            return ""
            
    # Default attempt image OCR
    return parse_image_with_ocr(content)
