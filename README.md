# Passage — AI-Powered Immigration Intake & Form Platform

**Passage** is an intelligent, full-stack immigration automation platform designed to turn bureaucratic immigration workflows into a seamless, conversational experience. Built for applicants, immigration lawyers, and paralegals, Passage pairs real-time **Optical Character Recognition (OCR)** with **LLM entity extraction**, **cross-application profile unification**, and **automated PDF form population**.

---

## 🌟 Key Features

### 1. Conversational Intake Assistant (`/chat`)
- **Multi-Country Chat Switcher**: Applicants can manage multiple active visa applications (e.g. *Canada Express Entry*, *Germany Opportunity Card*, *US O-1*) in dedicated conversation threads.
- **Smart Destination & Pathway Detection**: Automatically identifies target destination countries and visa sub-categories from natural language.
- **Strict Anti-Hallucination Guardrails**: Prompts applicants only for verified missing fields without fabricating dates, credentials, or test scores.
- **Live Checklist & Progress Sidebar**: Real-time visual tracking of extracted information and missing required fields.

### 2. In-Memory Pytesseract OCR Engine
- **In-Chat Document & Screenshot Upload**: Attach PDFs, passport scans, CVs, and image screenshots (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.docx`) directly inside the chat interface.
- **Dual-Layer PDF Extraction**: Extracts embedded digital text from vector PDFs, and automatically renders high-DPI bitmaps for scanned/image pages to run Tesseract-OCR.
- **Zero Image Storage (Privacy First)**: All documents and screenshots are processed strictly in ephemeral RAM buffers (`io.BytesIO`). **No photos or images are ever stored on disk or in the database.**

### 3. Unified Applicant Profile & Intelligent Pre-Filling
- **Cross-Application Data Reuse**: Verified personal data (e.g. full names, dates of birth, passport numbers, email) is aggregated into a **Unified Applicant Profile**.
- **Instant Pre-Fill**: When creating a new application for a different country, matching verified fields are automatically populated to eliminate redundant manual entry.

### 4. Client Application Management (`/applications`)
- **Centralized Dashboard**: Search, filter by country, view status pills, and monitor completeness bars for all user applications.
- **Interactive Form Field Editor**: Modal editor to update application details and key-value extracted fields with immediate database sync.
- **Case Deletion**: Securely remove completed or discarded cases.

### 5. Admin Console & Knowledge Base Builder (`/admin`, `/admin/knowledge-base`)
- **Case Audit Grid**: Review all applicants, confidence metrics, and case statuses.
- **Dynamic Application Form Generator**: Upload official immigration PDF guidelines to automatically extract form requirement fields via OCR + LLM.
- **Active Application Templates Hub**: View, inspect, edit, or delete country/visa schemas stored in PostgreSQL.

### 6. Unified Review & PDF Generation (`/review`)
- **Single Source of Truth**: Categorized biographical data, qualifications, and audit trails.
- **One-Click AcroForm Generation**: Generates compliant, downloadable PDF petition packages.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 16 (App Router)](https://nextjs.org), TypeScript, [Tailwind CSS](https://tailwindcss.com), Material Symbols |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com), Python 3.13, Uvicorn, Pydantic v2 |
| **Database & ORM** | PostgreSQL, [SQLAlchemy 2.0](https://www.sqlalchemy.org), Psycopg2 |
| **OCR & Document Parsing** | [Tesseract-OCR v5.4](https://github.com/tesseract-ocr/tesseract), `pytesseract`, `Pillow`, `PyMuPDF` (fitz), `pypdf` |
| **AI / LLM** | OpenAI API (`gpt-4o-mini`), JSON Mode Entity Extraction |
| **Vector Search (RAG)** | Pinecone Vector Database |

---

## 📁 Project Structure

```text
Passage/
├── backend/
│   ├── database.py             # SQLAlchemy engine & PostgreSQL connection
│   ├── llm_extractor.py        # OpenAI extraction & anti-hallucination chat logic
│   ├── main.py                 # FastAPI endpoints (Intake, Cases, Admin, Auth)
│   ├── models.py               # Database schemas (UserCaseState, CountrySchema)
│   ├── parsing_engine.py       # Tesseract-OCR & PyMuPDF in-memory parsing engine
│   ├── pdf_generator.py        # AcroForm & filled PDF generation
│   ├── vector_db.py            # Pinecone client initialization
│   ├── requirements.txt        # Backend dependencies
│   └── venv/                   # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── page.tsx               # Admin analytics & case audit grid
│   │   │   │   │   └── knowledge-base/page.tsx# Form builder & template hub
│   │   │   │   ├── applications/page.tsx      # Client application management
│   │   │   │   ├── chat/page.tsx              # Multi-chat assistant with OCR upload
│   │   │   │   ├── review/page.tsx            # Unified Profile review & PDF download
│   │   │   │   └── layout.tsx                 # Navigation sidebar & PostgreSQL health
│   │   │   ├── globals.css                    # Design tokens & Tailwind theme
│   │   │   ├── layout.tsx                     # Root layout & Google Fonts
│   │   │   └── page.tsx                       # Landing page
│   │   └── proxy.ts                           # Next.js authentication & role routing
│   ├── package.json                           # Frontend scripts & dependencies
│   └── tailwind.config.ts                     # Tailwind styling configuration
│
├── .env                        # Environment variables (OpenAI, PostgreSQL, Pinecone)
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ & **npm**
- **Python** 3.10+
- **PostgreSQL** running locally or via Docker
- **Tesseract-OCR binary** (Installed automatically on Windows via `winget install UB-Mannheim.TesseractOCR` or `apt-get install tesseract-ocr` on Linux)

---

### 1. Environment Configuration
Create a `.env` file in the root directory:

```env
# PostgreSQL Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# OpenAI API Key
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Pinecone (Optional for vector RAG)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=immigration-kb
```

---

### 2. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
API Documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cases` | List all active application cases for user |
| `POST` | `/api/cases/new` | Create new case (auto-prefilled from Unified Profile) |
| `GET` | `/api/cases/{case_id}` | Retrieve specific case state & completeness score |
| `PUT` | `/api/cases/{case_id}` | Update application fields, country, or status |
| `DELETE` | `/api/cases/{case_id}` | Delete application case from database |
| `GET` | `/api/user/profile` | Get aggregated Unified Applicant Profile |
| `POST` | `/api/intake/chat` | Send message to AI Intake Assistant |
| `POST` | `/api/intake/upload` | Upload document/screenshot for in-memory OCR extraction |
| `GET` | `/api/admin/forms` | List all saved country form requirement schemas |
| `POST` | `/api/admin/parse-form` | Parse guideline PDF into structured form builder fields |
| `POST` | `/api/admin/save-form` | Save custom form template schema |
| `DELETE` | `/api/admin/forms/{c}/{v}`| Delete custom form template schema |
| `POST` | `/api/application/generate` | Generate completed AcroForm PDF |

---

## 🔒 Security & Data Privacy

1. **Zero Image Retention Policy**: Uploaded documents are parsed strictly in memory and discarded immediately after OCR extraction.
2. **Encrypted State Persistence**: Only verified textual entities and structured schema fields are saved into PostgreSQL.
3. **No Hallucination Architecture**: AI is bounded by schema validation, preventing unverified claims on official immigration documents.

---

## 📄 License
MIT License © 2026 Passage Immigration AI.
