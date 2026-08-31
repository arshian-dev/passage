# Passage — Product Specification & Ideal SaaS Design Architecture (`info.md`)

## 📌 Executive Summary

**Passage** is an AI-native LegalTech SaaS platform engineered to automate international immigration intake, document verification, and government petition form preparation. By unifying **Optical Character Recognition (OCR)**, **LLM entity extraction**, **cross-application applicant profile synchronization**, and **automated AcroForm PDF population**, Passage reduces attorney intake time by **80%** and eliminates applicant form errors.

This document defines the product blueprint, user journeys, design systems, payment architectures, and page-by-page specifications for the **complete, commercial-ready SaaS application**.

---

## 🏛️ SaaS System Architecture & User Roles

### Role-Based Access Control (RBAC)

```mermaid
graph TD
    A[Visitor / Lead] -->|Auth / Social SSO| B[Passage SaaS Auth Gateway]
    B -->|Role: Applicant| C[Applicant Portal]
    B -->|Role: Paralegal| D[Legal Operations Portal]
    B -->|Role: Managing Attorney / Admin| E[Law Firm Command Center]

    subgraph Applicant Portal
        C1[Conversational Intake & OCR Upload]
        C2[Application Portfolio & Kanban]
        C3[Unified Credential Vault]
        C4[Pre-Filing Review & PDF Generation]
        C5[Stripe Billing & Subscription Hub]
    end

    subgraph Legal Operations Portal
        D1[Case Audit & Entity Verification]
        D2[Missing Document Request Engine]
        D3[Form Auto-Population & Review]
    end

    subgraph Law Firm Command Center
        E1[Multi-Tenant Analytics & KPI Ribbon]
        E2[Dynamic Visa Schema Studio]
        E3[Team Seats & Billing Management]
        E4[Regulatory RAG Knowledge Base]
    end

    C --> Applicant Portal
    D --> Legal Operations Portal
    E --> Law Firm Command Center
```

---

## 💎 Monetization & Stripe Payment Model

Passage operates on a hybrid **Product-Led Growth (PLG)** and **B2B SaaS subscription model** powered by **Stripe Billing** with Webhook synchronization:

| Tier | Target User | Price | Core Capabilities |
|---|---|---|---|
| **Free Explorer** | Prospective Immigrants | **$0** (Free Forever) | 1 Active Visa Case, 5 Document OCR Uploads, Standard AI Chat Assistant, Basic Form Checklist |
| **Passage Pro** | Individual Applicants & Families | **$29 / month** or **$249 / yr** | Unlimited Visa Cases, Unlimited In-Memory OCR Parsing, Unified Profile Auto-Sync, 1-Click Form & AcroForm PDF Generation, Email Support |
| **Lawyer-Assisted** | Premium High-Stakes Petitions | **$199 / case** (One-Time Addon) | All Pro features + Certified Immigration Attorney pre-filing compliance audit & 48-hour petition package review |
| **Enterprise Firm** | Law Firms & Global Mobility Teams | **$499 / mo** + **$49/seat** | Unlimited Paralegal/Attorney Seats, White-Labeling, Dynamic PDF Guideline Schema Parser, Bulk Case Export, Dedicated SLA & SOC2 Data Vault |

---

## 🖥️ Complete Page-by-Page SaaS Blueprint

---

### 1. High-Converting SaaS Landing Page (`/`)

* **Target URL**: `/`
* **File Reference**: [`frontend/src/app/page.tsx`](file:///d:/work/Passage/frontend/src/app/page.tsx)
* **Goal**: Maximize conversion from visitor to free trial or enterprise demo booking.

#### Key Sections & Features:
1. **Glassmorphic Navigation Bar**:
   - Brand Logo with micro-hover animation.
   - Jump Links: *Features*, *Supported Visas*, *How It Works*, *Pricing*, *Security & Compliance*.
   - Dark/Light mode switcher and Language localization selector (English, French, German, Spanish, Mandarin).
   - Direct CTA buttons: `Log In` (Modal/Auth page) and `Start Free Trial` (Primary Accent Button).
2. **Hero Header & Interactive Intake Simulator**:
   - High-impact headline: *"Immigration Paperwork, Streamlined by Artificial Intelligence."*
   - Subtitle: *"Upload your passport scan or CV screenshot. Watch our in-memory AI extract verified entities, check immigration eligibility, and pre-fill government visa forms in seconds."*
   - Interactive mini-demo container where users can click sample documents (e.g. *Sample Canadian Express Entry Passport*, *German Job Offer Letter*) to observe instant simulated OCR extraction.
3. **Trust & Security Badges**:
   - Zero Image Retention Guarantee banner (`"RAM-only in-memory processing. We never store photos or raw document scans"`).
   - Compliance emblems: **GDPR Compliant**, **SOC2 Type II Ready**, **256-Bit Bank-Grade TLS Encryption**.
4. **Interactive Visa Pathway Explorer**:
   - Dynamic tabs for popular destinations: 🇨🇦 **Canada Express Entry & PNPs**, 🇩🇪 **Germany Opportunity Card (Chancenkarte)**, 🇺🇸 **US O-1 / EB-2 NIW / H-1B**, 🇬🇧 **UK Global Talent**, 🇦🇺 **Australia Skilled Independent**.
   - Displays requirement difficulty, typical processing times, and required forms.
5. **How It Works (3-Step Visual Architecture)**:
   - **Step 1**: *Converse & Drop Documents* (AI answers country-specific questions and accepts multi-format uploads).
   - **Step 2**: *Instant In-Memory OCR & Entity Extraction* (PyMuPDF & Tesseract-OCR convert images to structured data).
   - **Step 3**: *Unified Profile & Automated Petition PDF* (Cross-application synchronization with 1-click compliant PDF export).
6. **Prominent Stripe Pricing & Payment Banner**:
   - Monthly / Annual toggle switch with an animated badge: `"Save 25% with Annual Billing"`.
   - Tier comparison cards with feature checkmarks, highlighted `"Most Popular"` badge on Pro tier, and direct Stripe Checkout triggers.
   - Enterprise consultation booking form integration (`"Schedule a Law Firm Demo"`).
   - 14-day money-back guarantee seal.
7. **Social Proof & Testimonials Carousel**:
   - Verified reviews from successful applicants and managing partners at boutique immigration law firms.
8. **Comprehensive FAQ Accordion**:
   - Covers data privacy, government form acceptance, attorney review options, and refund policies.
9. **Global SaaS Footer**:
   - Product, Company, Legal (Privacy Policy, Terms of Service, Security Whitepaper), System Status link, and social channels.

---

### 2. Authentication & Identity Suite (`/auth/*`)

* **Target URLs**:
  - `/auth/login` — Existing user login.
  - `/auth/signup` — New applicant or firm account registration.
  - `/auth/verify-mfa` — Two-factor authentication challenge.
  - `/auth/forgot-password` — Password reset flow.

#### Key Features & Architecture:
- **Enterprise Single Sign-On (SSO)**: One-click authentication with Google Workspace, Microsoft Azure AD (for law firms), Apple ID, and GitHub.
- **Passwordless Magic Links**: Instant secure login links delivered via transactional email (Resend / SendGrid).
- **Multi-Tenant Account Selection**: Allows attorney users to switch between client-facing portal and law firm workspace.
- **Multi-Factor Authentication (MFA/2FA)**: Mandatory TOTP authenticator app support (Google Authenticator, 1Password) for legal staff and attorneys.
- **Persistent Session & Cookie Policy**: JWT tokens with secure `HttpOnly`, `SameSite=Strict` cookies and refresh rotation.

---

### 3. Conversational AI Intake & Document Drop Assistant (`/chat`)

* **Target URL**: `/chat` (or `/chat?case_id={id}`)
* **File Reference**: [`frontend/src/app/(dashboard)/chat/page.tsx`](file:///d:/work/Passage/frontend/src/app/(dashboard)/chat/page.tsx)
* **Goal**: Guide applicants through conversational discovery, upload processing, and missing field collection.

#### Key Features & Architecture:
- **Multi-Case Conversation Switcher**: Sticky top bar allowing users to switch between different active visa pathways (e.g., `APP-1001: Canada Express Entry` vs. `APP-1002: Germany Chancenkarte`) or initiate a new application.
- **Intelligent Intake Chat Stream**:
  - AI proactively asks targeted questions to fill missing schema requirements.
  - Anti-hallucination guardrails bound by destination `CountrySchema`.
  - Supports rich markdown formatting with tables, bulleted criteria, and guidance links via [`MarkdownView.tsx`](file:///d:/work/Passage/frontend/src/app/components/MarkdownView.tsx).
- **Dual-Layer In-Memory OCR Upload Studio**:
  - Multi-file drag-and-drop zone (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.docx`).
  - Progress spinner indicating: `Rasterizing PDF -> Running Tesseract OCR -> LLM Entity Extraction`.
  - Real-time extraction preview chips highlighting detected passport details, language scores, degrees, and employment history.
- **Live Intake Progress & Requirement Sidebar**:
  - **Dynamic Readiness Gauge**: Radial progress meter (0% to 100%).
  - **Extracted Fields Accordion**: Live list of key-value pairs stored in the database.
  - **Missing Fields Checklist**: Real-time list of missing required fields that update dynamically as documents are uploaded.
  - **1-Click Review Button**: Activates once minimum requirements are met, routing to `/review`.
- **Request Attorney Review Button**: In-chat escalation trigger to request paralegal assistance on complex edge cases.

---

### 4. Application Portfolio & Case Management Hub (`/applications`)

* **Target URL**: `/applications`
* **File Reference**: [`frontend/src/app/(dashboard)/applications/page.tsx`](file:///d:/work/Passage/frontend/src/app/(dashboard)/applications/page.tsx)
* **Goal**: Provide an overview of all active, submitted, and archived immigration cases for the applicant.

#### Key Features & Architecture:
- **Portfolio Metrics Ribbon**: High-level counters for Active Petitions, Ready for Filing, In Review, and Average Completeness.
- **Search, Sort & Dynamic Filters**:
  - Text search by Case ID, applicant name, or visa class.
  - Filter chips for destination country (Canada, Germany, USA, UK, Australia).
  - Status filters (`DRAFT`, `IN_REVIEW`, `READY_FOR_FILING`, `SUBMITTED`, `ARCHIVED`).
- **Interactive Case Cards & List View**:
  - Displays Case ID, Country Flag badge, Visa classification, Last Modified date.
  - Visual completeness progress bar.
  - Quick action toolbar: `Continue Chat`, `Edit Form Data`, `Review & Download PDF`, `Delete Case`.
- **Modal Key-Value Entity Editor**:
  - Allows manual modification of extracted fields (e.g. updating an address or passport expiry date).
  - Add custom schema properties with immediate PostgreSQL database synchronization.
- **Create New Application Flow**:
  - Modal with destination country selector and visa pathway selector.
  - **Automatic Pre-Fill**: Instantly imports matching verified fields from the applicant's **Unified Profile**.

---

### 5. Unified Profile & Credential Vault (`/profile` & `/vault`)

* **Target URL**: `/profile`
* **Goal**: Provide a persistent, cross-application single-source-of-truth for the applicant's lifetime credentials.

#### Key Features & Architecture:
- **Biographical & Identity Locker**: Full legal names, birth certificates, current nationalities, and historical passport data.
- **Education & Credentials Repository**: Degree certificates, WES/ECA credential evaluation numbers, and transcripts.
- **Language Proficiency Tracker**: Official test results (IELTS, CELPIP, TOEFL, TEF, Goethe-Zertifikat) with automated score validation and expiry monitoring.
- **Employment History & NOC/SOC Mapping**: Previous employers, job titles, standard occupational classification (NOC/SOC) codes, and reference letters.
- **Cross-Application Sync Engine**: When an applicant applies for a second or third country, verified credentials in this locker automatically populate the new application schema.

---

### 6. Pre-Filing Review & PDF Generation Hub (`/review`)

* **Target URL**: `/review` (or `/review?case_id={id}`)
* **File Reference**: [`frontend/src/app/(dashboard)/review/page.tsx`](file:///d:/work/Passage/frontend/src/app/(dashboard)/review/page.tsx)
* **Goal**: Allow applicants and attorneys to verify all data and compile official petition PDF packages.

#### Key Features & Architecture:
- **Dual Review Mode Switcher**:
  - **Active Case Review**: Deep dive into the specific fields required for the current visa filing.
  - **Unified Master Record**: Broad view of all verified personal data across cases.
- **Categorized Data Verification Cards**:
  - Clean card sections for *Identity*, *Education*, *Work Experience*, and *Visa Specifics*.
  - Inline edit triggers to make last-minute corrections before rendering the final PDF.
- **Pre-Filing Compliance Checklist**:
  - Automatic audit alerts (e.g. `"Passport expires within 6 months"`, `"Language test score below CRS threshold"`).
  - Mandatory legal confirmation checkbox required before document generation.
- **1-Click PDF Generation & Download**:
  - Calls backend `/api/application/generate`.
  - ReportLab and PyPDF engine renders an official immigration summary and pre-filled AcroForm packet.
  - In-browser instant download with generated case metadata and timestamp watermarking.

---

### 7. Law Firm Command Center & Case Audit Grid (`/admin`)

* **Target URL**: `/admin`
* **File Reference**: [`frontend/src/app/(dashboard)/admin/page.tsx`](file:///d:/work/Passage/frontend/src/app/(dashboard)/admin/page.tsx)
* **Goal**: Enable managing attorneys, paralegals, and firm admins to oversee all client files in real time.

#### Key Features & Architecture:
- **Firm-Wide KPI Ribbon**:
  - Total Active Cases, Pending Audits, Processed Documents Today, and Average Completeness Score.
- **Comprehensive Case Audit Grid**:
  - Master table with columns for Case ID, Applicant Name/Email, Country, Visa Pathway, Total Extracted Entities, Completeness Bar, and Lifecycle Status.
  - Dynamic filtering by country, visa subclass, and assignees.
- **Detailed Case Inspection Drawer**:
  - Click any row to view raw JSON payloads, document extraction history, and conversational transcripts.
  - Assign paralegals or update case approval status (`Approve`, `Request Additional Evidence (RFE)`, `Reject`).
- **Bulk Export Tools**: Export case data to CSV, JSON, or zipped PDF petition archives for official government filing.

---

### 8. Dynamic Visa Schema Studio & Knowledge Base Builder (`/admin/knowledge-base`)

* **Target URL**: `/admin/knowledge-base`
* **File Reference**: [`frontend/src/app/(dashboard)/admin/knowledge-base/page.tsx`](file:///d:/work/Passage/frontend/src/app/(dashboard)/admin/knowledge-base/page.tsx)
* **Goal**: Empower law firms to create custom intake forms for any visa in the world without writing code.

#### Key Features & Architecture:
- **AI-Powered Guideline PDF Ingestion Engine**:
  - Drag-and-drop official government immigration manual or PDF checklist.
  - In-memory OCR extracts the text; LLM parses form fields, data types (`string`, `number`, `date`, `boolean`, `file`), and requirement flags.
- **Interactive Schema Visual Customizer**:
  - Add custom firm-specific questions (e.g., *"Has the applicant ever been denied a Schengen visa?"*).
  - Reorder, edit validation constraints, and mark fields as required/optional.
- **Saved Visa Templates Repository**:
  - Pre-seeded and custom schemas stored in the PostgreSQL `country_schemas` table.
  - Inspect, duplicate, version, or delete schemas.
  - Universal templates included for:
    - 🇨🇦 Canada Express Entry (Federal Skilled Worker)
    - 🇩🇪 Germany Opportunity Card (Chancenkarte)
    - 🇺🇸 US O-1A / EB-2 NIW
    - 🇬🇧 UK Skilled Worker Visa
    - 🇦🇺 Australia Subclass 189

---

### 9. Billing, Subscriptions & Stripe Customer Portal (`/billing`)

* **Target URL**: `/billing`
* **Goal**: Self-serve subscription management, invoice downloads, and add-on purchasing.

#### Key Features & Architecture:
- **Current Subscription Overview**: Displays active plan, renewal date, and seat usage.
- **Embedded Stripe Customer Portal**: One-click redirect to Stripe-hosted portal to manage payment methods, change billing addresses, or download tax invoices.
- **Upgrade / Downgrade Flows**: Seamless proration handling powered by Stripe Billing webhooks.
- **Usage-Based Add-Ons**: Buy additional attorney review credits ($199/ea) or bulk OCR processing packs.

---

## 🎨 Design System & UI/UX Standards

Passage follows a custom **Material Design 3 + Glassmorphism** design language tailored for modern legal applications:

```css
/* Core Color Palette Design Tokens */
:root {
  --primary: #0F4C81;           /* Classic Deep Navy - Authority & Trust */
  --primary-container: #D6E4FF; /* Soft Blue Fill */
  --secondary: #008080;         /* Modern Teal - Precision & Clarity */
  --secondary-container: #CCE8E8;
  --accent: #E5A93C;            /* Warm Amber - Highlights & CTAs */
  --background: #F8FAFC;        /* Crisp Off-White */
  --surface: #FFFFFF;           /* Card White */
  --surface-container: #F1F5F9; /* Subtle Section Background */
  --outline: #CBD5E1;           /* Crisp Border Divider */
  --on-background: #0F172A;     /* Slate-900 High Contrast Text */
}

/* Dark Mode Tokens */
.dark {
  --background: #0B0F17;        /* Midnight Dark */
  --surface: #111827;           /* Card Surface */
  --surface-container: #1E293B; /* Elevation Surface */
  --outline: #334155;           /* Subtle Dark Borders */
  --on-background: #F8FAFC;     /* Bright Text */
}
```

### Typography Hierarchy
* **Headings**: `Inter`, `Outfit`, or `Plus Jakarta Sans` (Bold, tight tracking `-0.02em`).
* **Body Text**: `Inter` (Regular/Medium, 1.5 line height for maximum legibility).
* **Data & Field Codes**: `JetBrains Mono` (Monospace for Case IDs, passport numbers, and JSON inspection).

### Motion & Micro-Interactions
* **Hover Elevation**: Subtle `translateY(-2px)` and ambient shadow glow on cards and buttons.
* **Loading Skeletons**: Shimmering pulse animations for OCR parsing states and table fetches.
* **Live Indicators**: Pulsing green status pills for active PostgreSQL connection and real-time intake synchronization.

---

## 🔒 Security, Compliance & Data Isolation Standards

1. **Zero Raw Image Retention**:
   - Files uploaded to `/api/intake/upload` and `/api/admin/parse-form` are handled strictly via ephemeral memory byte buffers (`io.BytesIO`).
   - Bitmaps are discarded immediately upon OCR completion.
   - **No photos, passport scans, or image files are saved to disk or database.**
2. **Anti-Hallucination Schema Bounding**:
   - The LLM extraction prompt enforces rigid JSON output schemas with strict zero-assumption rules.
   - Fields that are not explicitly present in the document are relegated to `missing_fields`.
3. **Data Encryption**:
   - All client data in PostgreSQL is encrypted at rest via AES-256.
   - All communications are enforced over TLS 1.3.

---

## 🚀 SaaS Launch Checklist & Next Steps

- [x] Full-stack architecture with Next.js 16 App Router & FastAPI.
- [x] In-memory Tesseract-OCR + PyMuPDF pipeline.
- [x] Cross-case unified applicant profile pre-filling.
- [x] Admin knowledge base & dynamic PDF guideline parser.
- [x] Comprehensive page-by-page SaaS blueprint and Stripe monetization model.
- [ ] Connect live Stripe API keys (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) for production checkout.
- [ ] Connect Resend API for transactional magic-link and notification emails.
- [ ] Connect Pinecone Vector DB for real-time regulatory RAG semantic search.

---

*Passage SaaS Architecture Specification © 2026 Passage Immigration AI Inc.*
