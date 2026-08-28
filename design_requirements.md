# Design Requirements: AI-Powered Immigration Agent Platform

Based on the SRS document, here is a detailed breakdown of the required screens, components, and user flows for the platform's design. This document outlines the functional layout requirements without prescribing specific visual aesthetics.

## 1. Global Platform Elements
- **Authentication/Login:** Secure login for Applicants and Admins.
- **Navigation/Sidebar:** To switch between active applications, document repository, and settings.
- **Status Indicators:** Clear visual indicators for application completion percentage and current step in the workflow.

## 2. Applicant Facing Interface

### 2.1 Dashboard & Application Hub
- **Active Applications List:** View current applications, target country, and visa type.
- **Progress Tracker:** Visual representation of completion status (e.g., "75% Complete - Awaiting Financial Documents").
- **New Application Wizard:** Selection flow for Target Country and Visa Type.

### 2.2 Intake & Chat Interface (The Conversational Agent)
- **Chat Window:** Primary interaction area with the AI agent. Must support text input and conversational history.
- **Multi-Modal Upload Area:** Drag-and-drop zone within or alongside the chat to upload documents (CVs, Passports, Bank Statements).
- **Live Checklist/Sidebar:** A real-time updating list showing "Extracted Information" vs. "Missing Fields" as the conversation progresses.
- **Ambiguity Resolution Prompts:** Distinct UI components within the chat for the user to clarify conflicting data (e.g., "Which Date of Birth is correct? [Option A] [Option B]").

### 2.3 Unified Applicant Profile Visualizer (Review Screen)
- **Categorized Data Cards:** Sections for Personal Info, Education, Work History, Travel History, etc.
- **Inline Editing:** Ability to click and edit any parsed or inputted field before final submission.
- **Confidence Alerts:** Highlighted fields for low-confidence extractions (< 85%) requiring explicit user review.
- **Final Approval Toggle:** A clear confirmation checkbox/toggle and a primary "Generate Final Application" button.

## 3. Administrator / Agency Facing Interface

### 3.1 Admin Dashboard
- **Case Management:** Overview of all applicant cases and their statuses.
- **Country Profile Management:** List of supported countries and visa types.

### 3.2 Knowledge Base Ingestion UI
- **Document Upload Portal:** Area to upload raw official forms (PDFs) and policy guides.
- **Schema Mapping Tool:** Interface to define mandatory/optional fields and map them to document types.
- **Vector Index Management:** Status of document chunking and indexing.

### 3.3 Verification Workspace
- **Application Audit View:** Interface for admins to review applicant-submitted data against original documents.
- **Generated PDF Preview:** PDF viewer to inspect the auto-filled AcroForms before official submission.
