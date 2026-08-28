# Software Requirements Specification (SRS)

## AI-Powered Immigration Agent Platform

**Document Version:** 1.0

**Date:** August 2026

**Status:** Initial Draft & Requirements Engineering

---

## 1. Executive Summary & Vision

### 1.1 Purpose

The **AI-Powered Immigration Agent Platform** is an enterprise-grade web application designed to simplify, automate, and streamline complex international immigration application processes. By pairing a Retrieval-Augmented Generation (RAG) backend with intelligent multi-modal document parsing and conversational AI, the platform acts as an automated immigration assistant for applicants and a centralized workflow hub for immigration administrators and agencies.

### 1.2 Product Vision

Traditional immigration workflows are notoriously fragmented, requiring applicants to manually navigate dense regulatory text, manually populate repetitive forms, and handle multi-step document submissions. This platform reverses the traditional model:

* **Administrators** upload raw official forms, policy guides, and field schemas per country.


* **The AI Agent** ingests these rules and dynamically orchestrates a conversational intake session.


* **The Parsing Engine** extracts applicant data from unformatted assets (CVs, passports, bank statements, transcripts) to minimize manual data entry.


* **The Application Hub** compiles a complete draft, allows human verification, and auto-populates official application formats.



---

## 2. Target User Personas & Roles

```
┌────────────────────────────────────────────────────────────────────────┐
│                             SYSTEM USERS                               │
├───────────────────────────────┬────────────────────────────────────────┤
│     Immigration Applicant     │       System / Agency Admin            │
│  - Submits documents/CVs      │  - Uploads country forms/rules         │
│  - Completes AI interview     │  - Manages RAG knowledge base          │
│  - Reviews auto-filled profile│  - Validates applicant submissions     │
└───────────────────────────────┴────────────────────────────────────────┘
```[cite: 1]

### 2.1 The Applicant (End User)
- **Profile:** Individuals applying for work, study, residency, or travel visas across various international jurisdictions[cite: 1].
- **Pain Points:** Overwhelmed by bureaucratic jargon, afraid of making errors on lengthy forms, time-constrained, lost in multi-document requirements[cite: 1].
- **Goals:** Upload existing documents (CV, passport, financial records) to auto-fill details, complete missing fields via intuitive dialogue, and review a clear, final draft before official filing[cite: 1].

### 2.2 The Administrator (Immigration Specialist / System Admin)
- **Profile:** Immigration consultants, agency managers, or system administrators responsible for maintaining regulatory accuracy and processing cases[cite: 1].
- **Pain Points:** Frequently changing country policies, tedious form updates, manually copying data between candidate resumes and government applications[cite: 1].
- **Goals:** Centralize country-specific document requirements, ingest official PDF templates, map form fields dynamically, and audit filled applications[cite: 1].

---

## 3. High-Level System Architecture & Flow

### 3.1 End-to-End System Workflow

```

┌─────────────────────────────────────────────────────────────────────┐
│                      1. INGESTION & KNOWLEDGE                       │
│  [ Admin ] ──► Upload Official Forms/Rules ──► [ RAG Pipeline ]     │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│                      2. INTAKE & EXTRACTION                         │
│  [ User ] ──► Upload CV / Passport / Docs ──► [ Multi-Modal OCR ]   │
│                                                         │           │
│                                                         ▼           │
│  [ AI Agent ] ◄── Reconcile Schema ◄── Extract Extracted JSON       │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│                      3. INTERACTIVE GAP-FILLING                     │
│  [ AI Agent ] ◄── Conversational Q&A ──► [ User Missing Inputs ]    │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│                      4. REVIEW & FORM GENERATION                    │
│  [ User ] ──► Approves Preview Draft ──► [ PDF / Form Generator ]   │
└─────────────────────────────────────────────────────────────────────┘

```[cite: 1]

---

## 4. Functional Requirements & Feature Specifications

### 4.1 Knowledge Base & RAG Pipeline (Admin Module)

#### FR-KB-01: Multi-Country Form Ingestion
- System must allow admins to create and manage country profile repositories (e.g., Canada, United Kingdom, Australia, Germany)[cite: 1].
- System must accept raw PDF templates, official instructional guides, and JSON field schemas[cite: 1].

#### FR-KB-02: Document Chunking & Vector Store Indexing
- Embedded vector database must store split chunks of official guidance, paired with metadata (Country Code, Visa Subtype, Effective Date, Field Key)[cite: 1].
- Vector retrieval must prioritize exact field key lookup combined with semantic retrieval for contextual policy questions[cite: 1].

#### FR-KB-03: Dynamic Field Mapping & Rule Engine
- Admins can map specific form fields (e.g., `given_name`, `passport_exp_date`, `employment_history_5yr`) to mandatory vs. optional tags and extraction constraints[cite: 1].
- System must calculate an application completion percentage dynamically based on indexed schema requirements[cite: 1].

#### FR-KB-04: Graceful Missing Country Detection
- When a user selects a target destination or visa type not present in the vector index, the system must trigger an explicit alert:
  > *"We currently do not have the verified immigration requirements loaded for [Country Name - Visa Type]. Please select an alternative jurisdiction or request administrator indexing."*[cite: 1]

---

### 4.2 Multi-Modal Document Parsing Engine

#### FR-PAR-01: CV / Resume Automated Parsing
- System must ingest resumes in `.pdf`, `.docx`, `.txt`, and `.png/jpeg` formats[cite: 1].
- Parsing agent must automatically extract structured entities[cite: 1]:
  - Personal Information (Full Name, Phone, Email, Address, Nationality)[cite: 1].
  - Educational Background (Institutions, Degrees, Graduation Dates, Majors)[cite: 1].
  - Work Experience (Employers, Job Titles, Start/End Dates, Responsibilities)[cite: 1].
  - Language Skills & Certifications[cite: 1].

#### FR-PAR-02: Identity & Official Document OCR
- Intake pipeline must accept scanned assets (Passports, National IDs, Birth Certificates, Financial Statements)[cite: 1].
- System must execute OCR and Key-Value Extraction to pull[cite: 1]:
  - Document Number, Date of Issue, Date of Expiry, Issuing Authority[cite: 1].
  - Machine Readable Zone (MRZ) parsing for passports[cite: 1].

#### FR-PAR-03: Data Normalization & Confidence Scoring
- Extracted values must be mapped directly to the target country schema[cite: 1].
- System must assign a confidence score ($0.0 - 1.0$) to parsed fields[cite: 1].
- Low-confidence extractions ($< 0.85$) must be queued for explicit conversational confirmation by the AI Agent[cite: 1].

---

### 4.3 Conversational AI Agent & Intake Session

#### FR-AGT-01: Dynamic Requirement Retrieval
- Upon starting a session, the agent retrieves the exact list of required data points for the user's selected destination country and visa type[cite: 1].

#### FR-AGT-02: Context-Aware Interviewing
- The agent compares extracted document payload against the target country schema[cite: 1].
- Agent conducts an interactive chat, asking targeted, sequential questions for missing fields only, avoiding redundant questions for already-extracted data[cite: 1].

#### FR-AGT-03: Multi-Modal Upload Handling in Chat
- Users can drop documents directly into the chat interface at any point in the dialogue[cite: 1].
- The agent acknowledges receipt, parses the file asynchronously, notifies the user of discovered details, and updates the missing-field checklist live[cite: 1].

#### FR-AGT-04: Exception & Ambiguity Resolution
- If user input conflicts with parsed document data (e.g., conflicting dates of birth), the agent prompts the user to select or clarify the accurate value[cite: 1].

---

### 4.4 Form Preview, Approval & Auto-Filling

#### FR-PRV-01: Unified Applicant Profile Visualizer
- The user interface must present a categorized summary card view of all collected data (Personal Info, Education, Work History, Travel History)[cite: 1].
- Users can inline-edit any field prior to final sign-off[cite: 1].

#### FR-PRV-02: Draft Verification Sign-Off
- The platform provides an explicit approval toggle: *"I confirm that the information provided is accurate and complete for form population."*[cite: 1]

#### FR-PRV-03: Backend Form Generation
- Upon user approval, the backend mapping engine injects the normalized data into official PDF AcroForms or structured XML/JSON payloads required by target portals[cite: 1].
- Generates downloadable, fully populated PDF form packages ready for official submission[cite: 1].

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Security, Privacy & Compliance
- **Data Encryption:** All user assets and PII (Personally Identifiable Information) must be encrypted in transit (TLS 1.3) and at rest (AES-256)[cite: 1].
- **PII Isolation:** Uploaded passports, identity documents, and CVs must be isolated per tenant/user session with strict RBAC (Role-Based Access Control)[cite: 1].
- **Compliance:** Built to align with GDPR, HIPAA/PIPEDA data handling guidelines where applicable[cite: 1].

### 5.2 Performance & Responsiveness
- **Document Parsing Latency:** CV/Passport parsing and entity extraction must complete in $< 5.0$ seconds for standard files ($< 10\text{ MB}$)[cite: 1].
- **Conversational Latency:** AI Agent time-to-first-token must be $< 1.2$ seconds for standard chat interaction[cite: 1].
- **RAG Retrieval Accuracy:** High-precision semantic retrieval ($Top\text{-}k = 5$) to ensure regulatory text compliance[cite: 1].

### 5.3 Scalability & Multi-Tenancy
- Microservice or modular architecture separating Vector Indexing, Parsing Pipeline, Chat Execution, and PDF Filling Services[cite: 1].
- Storage pipeline capable of handling high-throughput PDF generation without blocking real-time chat threads[cite: 1].

---

## 6. Technical Data Schema Examples

### 6.1 Country Schema Definition (JSON)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "country_code": "CA",
  "visa_type": "EXPRESS_ENTRY_SKILLED",
  "version": "2026.1",
  "required_fields": [
    {
      "field_id": "applicant_given_name",
      "label": "Given Name(s)",
      "type": "string",
      "source_mapping": ["passport.given_name", "cv.first_name"],
      "mandatory": true
    },
    {
      "field_id": "total_years_experience",
      "label": "Total Years of Skilled Experience",
      "type": "number",
      "source_mapping": ["cv.work_history_calculated_years"],
      "mandatory": true,
      "validation_rule": ">= 1"
    }
  ]
}
```[cite: 1]

### 6.2 User Case State Data Model (JSON)
```json
{
  "case_id": "case_987654321",
  "user_id": "usr_alpha_101",
  "target_country": "CA",
  "visa_type": "EXPRESS_ENTRY_SKILLED",
  "status": "GAP_FILLING",
  "extracted_data": {
    "applicant_given_name": "Alexander",
    "applicant_family_name": "Mercer",
    "passport_number": "A12345678",
    "total_years_experience": 4.5
  },
  "missing_fields": [
    "proof_of_funds_amount",
    "language_test_score_ielts"
  ],
  "uploaded_documents": [
    {
      "doc_id": "doc_cv_001",
      "file_name": "Alex_Mercer_Resume.pdf",
      "parsed_at": "2026-08-26T22:15:00Z"
    }
  ]
}
```[cite: 1]

---

## 7. Next Steps & Development Roadmap

1. **Phase 1: Knowledge Base & RAG Foundations**[cite: 1]
   - Admin upload dashboard for country policy documents[cite: 1].
   - Vector database integration and country schema management[cite: 1].
2. **Phase 2: Parsing Engine & Extraction**[cite: 1]
   - OCR and LLM-based entity extraction for resumes and identity documents[cite: 1].
3. **Phase 3: Conversational Agent & Gap-Filling UI**[cite: 1]
   - State-aware chat interface tracking completed vs. missing fields[cite: 1].
4. **Phase 4: PDF Generation & Verification Workspace**[cite: 1]
   - AcroForm mapping engine and interactive review dashboard[cite: 1].

```