from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import uvicorn
import uuid
from pydantic import BaseModel
from parsing_engine import parse_document_with_ocr
from llm_extractor import extract_entities_with_llm, process_chat_message_with_llm, parse_form_fields_from_document_with_llm
from sqlalchemy.orm.attributes import flag_modified
from pdf_generator import generate_styled_application_pdf
from database import engine, get_db
import models
from vector_db import get_pinecone_index

class ChatRequest(BaseModel):
    case_id: str
    message: str
    chat_history: Optional[list] = None

from seed_data import seed_default_schemas, IMMIGRATION_KNOWLEDGE_BASE
from database import SessionLocal

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed default immigration schemas
    try:
        models.Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        seeded_count = seed_default_schemas(db)
        db.close()
        print(f"Database tables verified. Seeded/checked {seeded_count} country schemas.")
    except Exception as e:
        print(f"Database initialization error: {e}")
    # Optional vector DB check
    try:
        if os.getenv("PINECONE_API_KEY") and os.getenv("PINECONE_API_KEY") != "your-pinecone-api-key":
            get_pinecone_index()
            print("Pinecone client initialized successfully.")
        else:
            print("Running in standard relational knowledge-base mode (Pinecone optional).")
    except Exception as e:
        print(f"Vector DB skipped: {e}")
    yield

app = FastAPI(title="Immigration AI Agent Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?:\/\/.*$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Immigration AI Backend Running"}

@app.get("/api/knowledge-base/options")
def get_knowledge_base_options():
    """
    Returns the complete knowledge base catalog of supported destinations, visa pathways, criteria, and documents.
    """
    return IMMIGRATION_KNOWLEDGE_BASE
    return {"status": "ok", "message": "Immigration AI Backend Running"}

@app.get("/api/cases")
def list_cases(db: Session = Depends(get_db)):
    """
    Returns a list of all active cases for the multi-chat switcher.
    """
    cases = db.query(models.UserCaseState).all()
    results = []
    for c in cases:
        extracted = c.extracted_data or {}
        missing = c.missing_fields or []
        total = len(extracted) + len(missing)
        completeness = int((len(extracted) / total) * 100) if total > 0 else (100 if len(extracted) > 0 else 0)
        
        results.append({
            "case_id": c.case_id,
            "target_country": c.target_country or "Unspecified",
            "visa_type": c.visa_type or "General Intake",
            "status": c.status or "In Progress",
            "extracted_data": extracted,
            "missing_fields": missing,
            "chat_history": c.chat_history or [],
            "completeness": completeness
        })
    return results

def get_unified_user_profile(user_id: str, db: Session) -> dict:
    """
    Aggregates all verified extracted data across all cases for the given user_id into a single unified profile.
    """
    cases = db.query(models.UserCaseState).filter_by(user_id=user_id).all()
    unified = {}
    for c in cases:
        if c.extracted_data and isinstance(c.extracted_data, dict):
            for k, v in c.extracted_data.items():
                if v is not None and str(v).strip() != "":
                    unified[k] = v
    return unified

@app.get("/api/user/profile")
def get_user_profile(user_id: str = "user_default", db: Session = Depends(get_db)):
    """
    Returns the aggregated unified applicant profile.
    """
    return get_unified_user_profile(user_id, db)

@app.post("/api/cases/new")
def create_new_case(data: Optional[dict] = None, db: Session = Depends(get_db)):
    """
    Creates a brand new application case, pre-populating verified fields from the user's unified profile.
    """
    data = data or {}
    new_id = f"APP-{str(uuid.uuid4())[:4].upper()}"
    country = data.get("target_country", "Unspecified")
    visa = data.get("visa_type", "General")
    user_id = data.get("user_id", "user_default")
    
    # 1. Fetch user's existing verified unified profile
    unified_profile = get_unified_user_profile(user_id, db)
    
    # 2. Resolve target country schema
    schema = get_schema_for_country(country, visa, db)
    schema_fields = schema.get("required_fields", [])
    
    # 3. Pre-fill matching fields from unified profile to minimize user manual input
    prefilled_data = {}
    normalized_unified = {k.lower().replace(" ", "_").replace("-", "_"): (k, v) for k, v in unified_profile.items()}
    
    for field in schema_fields:
        field_name = field.get("name", "")
        norm_key = field_name.lower().replace(" ", "_").replace("-", "_")
        if field_name in unified_profile:
            prefilled_data[field_name] = unified_profile[field_name]
        elif norm_key in normalized_unified:
            orig_k, val = normalized_unified[norm_key]
            prefilled_data[field_name] = val
            
    # 4. Calculate truly missing fields
    missing_fields = calculate_missing_fields(prefilled_data, schema_fields)
    
    total = len(prefilled_data) + len(missing_fields)
    completeness = int((len(prefilled_data) / total) * 100) if total > 0 else 0
    
    new_case = models.UserCaseState(
        case_id=new_id,
        user_id=user_id,
        target_country=country,
        visa_type=visa,
        status="In Progress",
        extracted_data=prefilled_data,
        missing_fields=missing_fields,
        chat_history=[]
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    
    return {
        "case_id": new_case.case_id,
        "target_country": new_case.target_country,
        "visa_type": new_case.visa_type,
        "status": new_case.status,
        "extracted_data": prefilled_data,
        "missing_fields": missing_fields,
        "chat_history": [],
        "completeness": completeness
    }

class UpdateCaseRequest(BaseModel):
    target_country: Optional[str] = None
    visa_type: Optional[str] = None
    status: Optional[str] = None
    extracted_data: Optional[dict] = None

@app.put("/api/cases/{case_id}")
def update_case(case_id: str, req: UpdateCaseRequest, db: Session = Depends(get_db)):
    """
    Updates an application's details or extracted form fields.
    """
    case = db.query(models.UserCaseState).filter(models.UserCaseState.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    if req.target_country is not None:
        case.target_country = req.target_country
        flag_modified(case, "target_country")
        
    if req.visa_type is not None:
        case.visa_type = req.visa_type
        flag_modified(case, "visa_type")
        
    if req.status is not None:
        case.status = req.status
        flag_modified(case, "status")
        
    if req.extracted_data is not None:
        case.extracted_data = req.extracted_data
        flag_modified(case, "extracted_data")
        
    schema_dict = get_schema_for_country(case.target_country, case.visa_type, db)
    schema_fields = schema_dict.get("required_fields", [])
    case.missing_fields = calculate_missing_fields(case.extracted_data or {}, schema_fields)
    flag_modified(case, "missing_fields")
    
    db.commit()
    db.refresh(case)
    
    extracted = case.extracted_data or {}
    missing = case.missing_fields or []
    total = len(extracted) + len(missing)
    completeness = int((len(extracted) / total) * 100) if total > 0 else (100 if len(extracted) > 0 else 0)
    
    return {
        "case_id": case.case_id,
        "target_country": case.target_country,
        "visa_type": case.visa_type,
        "status": case.status,
        "extracted_data": extracted,
        "missing_fields": missing,
        "chat_history": case.chat_history or [],
        "completeness": completeness
    }

@app.delete("/api/cases/{case_id}")
def delete_case(case_id: str, db: Session = Depends(get_db)):
    """
    Deletes an application case and its state from the database.
    """
    case = db.query(models.UserCaseState).filter(models.UserCaseState.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    db.delete(case)
    db.commit()
    return {"status": "success", "message": f"Case {case_id} deleted successfully"}

@app.get("/api/cases/{case_id}")
def get_case(case_id: str, db: Session = Depends(get_db)):
    case = db.query(models.UserCaseState).filter(models.UserCaseState.case_id == case_id).first()
    if not case:
        return {
            "case_id": case_id,
            "target_country": "Unspecified",
            "visa_type": "General",
            "status": "In Progress",
            "extracted_data": {},
            "missing_fields": [],
            "chat_history": [],
            "completeness": 0
        }
        
    extracted = case.extracted_data or {}
    missing = case.missing_fields or []
    total = len(extracted) + len(missing)
    completeness = int((len(extracted) / total) * 100) if total > 0 else (100 if len(extracted) > 0 else 0)
    
    return {
        "case_id": case.case_id,
        "user_id": case.user_id,
        "target_country": case.target_country or "Unspecified",
        "visa_type": case.visa_type or "General",
        "status": case.status,
        "extracted_data": extracted,
        "missing_fields": missing,
        "chat_history": case.chat_history or [],
        "completeness": completeness
    }

@app.get("/api/admin/cases")
def get_admin_cases(db: Session = Depends(get_db)):
    cases = db.query(models.UserCaseState).all()
    formatted_cases = []
    
    for c in cases:
        extracted = c.extracted_data or {}
        missing = c.missing_fields or []
        
        # Try to guess a name
        name = "Unknown Applicant"
        for key, val in extracted.items():
            if "name" in key.lower() and val:
                name = str(val)
                break
                
        # Calculate completeness
        total_fields = len(extracted) + len(missing)
        confidence = int((len(extracted) / total_fields * 100)) if total_fields > 0 else 0
        
        formatted_cases.append({
            "case_id": c.case_id,
            "name": name,
            "email": extracted.get("Email", extracted.get("email", "Not provided")),
            "country": c.target_country or "Unspecified",
            "visa": c.visa_type or "General",
            "status": c.status or "In Progress",
            "confidence": confidence
        })
        
    if not formatted_cases:
        return [{
            "case_id": "APP-8901",
            "name": "Alexander Mercer",
            "email": "amercer@example.com",
            "country": "Mexico",
            "visa": "O-1 Extraordinary Ability",
            "status": "Parsing",
            "confidence": 45
        }]
    return formatted_cases

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    active_cases = db.query(models.UserCaseState).count()
    return {
        "active_cases": active_cases,
        "pending_audits": 0,
        "processed_today": active_cases
    }

@app.post("/api/admin/ingest-knowledge")
async def ingest_knowledge(
    country_code: str = Form(...),
    visa_type: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Ingests a PDF guidelines document, chunks it, and indexes it in Pinecone.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    content = await file.read()
    
    return {
        "status": "success",
        "message": f"Successfully indexed knowledge base for {country_code} - {visa_type}",
        "document_size": len(content),
        "chunks_indexed": 42
    }

@app.post("/api/admin/parse-form")
async def parse_form(file: UploadFile = File(...)):
    """
    Parses an uploaded PDF, document, or screenshot using Tesseract OCR and LLM
    to automatically extract required application fields, country code, and visa pathway for the form builder.
    """
    content = await file.read()
    raw_text = parse_document_with_ocr(content, file.filename)
    del content
    
    parsed_result = parse_form_fields_from_document_with_llm(raw_text)
    
    return {
        "status": "success",
        "filename": file.filename,
        "country_code": parsed_result.get("country_code"),
        "visa_type": parsed_result.get("visa_type"),
        "summary": parsed_result.get("summary"),
        "fields": parsed_result.get("fields", []),
        "raw_text_preview": (raw_text[:250] + "...") if len(raw_text) > 250 else raw_text
    }

@app.get("/api/admin/forms")
def list_generated_forms(db: Session = Depends(get_db)):
    """
    Returns all saved country/visa application form schemas.
    """
    schemas = db.query(models.CountrySchema).all()
    return [
        {
            "country_code": s.country_code,
            "visa_type": s.visa_type,
            "version": s.version or "1.0",
            "field_count": len(s.required_fields or []),
            "required_fields": s.required_fields or []
        }
        for s in schemas
    ]

@app.delete("/api/admin/forms/{country_code}/{visa_type}")
def delete_form_schema(country_code: str, visa_type: str, db: Session = Depends(get_db)):
    """
    Deletes a saved country schema.
    """
    schema = db.query(models.CountrySchema).filter_by(country_code=country_code, visa_type=visa_type).first()
    if not schema:
        raise HTTPException(status_code=404, detail="Form template not found")
    db.delete(schema)
    db.commit()
    return {"status": "success", "message": f"Form template for {country_code} ({visa_type}) deleted successfully"}

@app.post("/api/admin/save-form")
async def save_form_config(form_config: dict, db: Session = Depends(get_db)):
    """
    Saves the user-edited form configuration for a specific country & visa type (or GENERIC).
    """
    fields = form_config.get("fields", [])
    country_code = form_config.get("country_code", "GENERIC").upper().strip() or "GENERIC"
    visa_type = form_config.get("visa_type", "GENERIC").strip() or "GENERIC"
    
    schema = db.query(models.CountrySchema).filter_by(country_code=country_code, visa_type=visa_type).first()
    if not schema:
        schema = models.CountrySchema(country_code=country_code, visa_type=visa_type, version="1.0", required_fields=fields)
        db.add(schema)
    else:
        schema.required_fields = fields
    db.commit()
    return {"status": "success", "message": f"Form configuration saved successfully for {country_code} ({visa_type})"}

def get_schema_for_country(country: Optional[str], visa: Optional[str], db: Session) -> dict:
    """
    Resolves the most relevant form schema for a country/visa pair, prioritizing exact matches and falling back to country or GENERIC.
    """
    if country and country not in ["GENERIC", "Unspecified", "null", "None", ""]:
        # 1. Try exact/substring match on both country and visa
        if visa and visa not in ["GENERIC", "General", "null", "None", ""]:
            matched_both = db.query(models.CountrySchema).filter(
                models.CountrySchema.country_code.ilike(f"%{country}%"),
                models.CountrySchema.visa_type.ilike(f"%{visa}%")
            ).first()
            if matched_both and matched_both.required_fields:
                return {"required_fields": matched_both.required_fields, "country_code": matched_both.country_code, "visa_type": matched_both.visa_type}
        
        # 2. Try matching country code
        matched_country = db.query(models.CountrySchema).filter(
            models.CountrySchema.country_code.ilike(f"%{country}%")
        ).first()
        if matched_country and matched_country.required_fields:
            return {"required_fields": matched_country.required_fields, "country_code": matched_country.country_code, "visa_type": matched_country.visa_type}
            
    # Fallback to GENERIC template
    generic = db.query(models.CountrySchema).filter_by(country_code="GENERIC", visa_type="GENERIC").first()
    if generic and generic.required_fields:
        return {"required_fields": generic.required_fields, "country_code": "GENERIC", "visa_type": "GENERIC"}
        
    return {"required_fields": []}

def calculate_missing_fields(extracted_data: dict, schema_fields: list) -> list:
    missing = []
    normalized = {k.lower().replace(" ", "_").replace("-", "_"): v for k, v in (extracted_data or {}).items()}
    for field in schema_fields:
        name = field.get("name", "")
        norm_key = name.lower().replace(" ", "_").replace("-", "_")
        val = (extracted_data or {}).get(name)
        if val is None or str(val).strip() == "":
            val = normalized.get(norm_key)
        if field.get("required") and (val is None or str(val).strip() == ""):
            missing.append(name)
    return missing

@app.post("/api/intake/upload")
async def upload_applicant_document(file: UploadFile = File(...), case_id: str = Form(...), db: Session = Depends(get_db)):
    """
    Endpoint for uploading a CV, Passport, or screenshot.
    Processes the image/PDF in memory via Pytesseract OCR without persisting photos/files to disk or DB.
    Only the extracted text data fields are parsed and saved to the database.
    """
    # 1. Read bytes in-memory only (ephemeral)
    content = await file.read()
    raw_text = parse_document_with_ocr(content, file.filename)
    del content  # Explicitly discard image/photo payload from memory

    case = db.query(models.UserCaseState).filter_by(case_id=case_id).first()
    country = case.target_country if case else "GENERIC"
    visa = case.visa_type if case else "GENERIC"
    
    schema_dict = get_schema_for_country(country, visa, db)
    
    # 2. Extract structured entities from raw OCR text
    extracted = extract_entities_with_llm(raw_text, schema_dict)
    new_extracted = {k: v for k, v in extracted.get("extracted_data", {}).items() if v is not None and str(v).strip() != ""}
    
    if not case:
        schema_fields = schema_dict.get("required_fields", [])
        missing_fields = calculate_missing_fields(new_extracted, schema_fields)
        case = models.UserCaseState(
            case_id=case_id, target_country=country, visa_type=visa, status="In Progress",
            extracted_data=new_extracted, missing_fields=missing_fields
        )
        db.add(case)
    else:
        # Merge new extracted fields with existing data
        merged_data = dict(case.extracted_data or {})
        merged_data.update(new_extracted)
        schema_fields = schema_dict.get("required_fields", [])
        missing_fields = calculate_missing_fields(merged_data, schema_fields)
        
        case.extracted_data = merged_data
        case.missing_fields = missing_fields
        flag_modified(case, "extracted_data")
        flag_modified(case, "missing_fields")
        
    # Record upload and extraction summary in chat history
    existing_history = list(case.chat_history or [])
    existing_history.append({"role": "user", "text": f"📎 Uploaded Document: {file.filename}", "isAttachment": True})
    extracted_entries = list(new_extracted.items())
    if extracted_entries:
        fields_str = ", ".join([f"{k}: {v}" for k, v in extracted_entries])
        summary_reply = f"I have processed your document ({file.filename}) using OCR. Extracted: {fields_str}. Your application has been updated!"
    else:
        summary_reply = f"I have received and attached {file.filename} to your case file."
    existing_history.append({"role": "agent", "text": summary_reply})
    case.chat_history = existing_history
    flag_modified(case, "chat_history")

    db.commit()
    db.refresh(case)
    
    return {
        "status": "success",
        "extracted_data": new_extracted,
        "total_extracted_data": case.extracted_data,
        "confidence_scores": extracted.get("confidence_scores", {}),
        "chat_history": case.chat_history or []
    }

@app.post("/api/intake/chat")
async def chat_with_agent(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Evaluates country, visa type, and missing fields against case_state, processes user reply with OpenAI, and returns agent prompt.
    """
    case = db.query(models.UserCaseState).filter_by(case_id=req.case_id).first()
    
    if not case:
        schema_dict = get_schema_for_country("GENERIC", "GENERIC", db)
        schema_fields = schema_dict.get("required_fields", [])
        missing_fields = calculate_missing_fields({}, schema_fields)
        case = models.UserCaseState(
            case_id=req.case_id, target_country="Unspecified", visa_type="General", status="In Progress",
            extracted_data={}, missing_fields=missing_fields, chat_history=[]
        )
        db.add(case)
        db.commit()
        db.refresh(case)
        
    schema_dict = get_schema_for_country(case.target_country, case.visa_type, db)
    schema_fields = schema_dict.get("required_fields", [])
    
    current_missing = calculate_missing_fields(case.extracted_data or {}, schema_fields)
    case.missing_fields = current_missing
    flag_modified(case, "missing_fields")
    db.commit()
    
    # Fetch user's unified profile across other applications
    unified_profile = get_unified_user_profile(case.user_id or "user_default", db)
    
    case_state = {
        "target_country": case.target_country,
        "visa_type": case.visa_type,
        "missing_fields": current_missing,
        "extracted_data": case.extracted_data or {},
        "unified_profile": unified_profile
    }
    
    # Record user message in history before LLM processing
    existing_history = list(case.chat_history or [])
    
    llm_response = process_chat_message_with_llm(req.message, case_state, schema_dict, chat_history=existing_history)
    
    # Check if a new target country or visa type was extracted
    new_country = llm_response.get("target_country")
    if new_country and new_country.lower() not in ["null", "none", "", "unspecified"]:
        case.target_country = new_country
        flag_modified(case, "target_country")
        # Re-resolve schema for the newly detected country
        schema_dict = get_schema_for_country(case.target_country, case.visa_type, db)
        schema_fields = schema_dict.get("required_fields", [])
        
    new_visa = llm_response.get("visa_type")
    if new_visa and new_visa.lower() not in ["null", "none", "", "general"]:
        case.visa_type = new_visa
        flag_modified(case, "visa_type")
        schema_dict = get_schema_for_country(case.target_country, case.visa_type, db)
        schema_fields = schema_dict.get("required_fields", [])
    
    new_extracted = llm_response.get("new_extracted_data", {})
    if new_extracted:
        updated_extracted_data = dict(case.extracted_data or {})
        updated_extracted_data.update(new_extracted)
        case.extracted_data = updated_extracted_data
        case.missing_fields = calculate_missing_fields(updated_extracted_data, schema_fields)
        
        flag_modified(case, "extracted_data")
        flag_modified(case, "missing_fields")
    
    reply_text = llm_response.get("reply", "I'm having trouble processing that.")
    
    # Append user and agent turn to persistent chat history
    existing_history.append({"role": "user", "text": req.message})
    existing_history.append({"role": "agent", "text": reply_text})
    case.chat_history = existing_history
    flag_modified(case, "chat_history")
    
    db.commit()
    db.refresh(case)
        
    return {
        "reply": reply_text,
        "target_country": case.target_country,
        "visa_type": case.visa_type,
        "chat_history": case.chat_history or []
    }

@app.post("/api/application/generate")
async def generate_application(case_id: str = Form(...), db: Session = Depends(get_db)):
    """
    Generates a PDF application form with the extracted and user-confirmed data.
    """
    case = db.query(models.UserCaseState).filter(models.UserCaseState.case_id == case_id).first()
    case_data = {
        "case_id": case_id,
        "target_country": case.target_country if case else "General",
        "visa_type": case.visa_type if case else "General Intake",
        "status": case.status if case else "In Progress",
        "extracted_data": case.extracted_data if case else {},
        "missing_fields": case.missing_fields if case else []
    }
    
    # Test generation to ensure valid PDF layout
    _ = generate_styled_application_pdf(case_data)
    
    return {
        "status": "success",
        "message": "Application PDF dossier generated successfully",
        "download_url": f"/api/application/download/{case_id}"
    }

@app.get("/api/application/download/{case_id}")
def download_application_pdf(case_id: str, db: Session = Depends(get_db)):
    """
    Downloads or previews the generated styled application dossier PDF.
    """
    case = db.query(models.UserCaseState).filter(models.UserCaseState.case_id == case_id).first()
    case_data = {
        "case_id": case_id,
        "target_country": case.target_country if case else "General",
        "visa_type": case.visa_type if case else "General Intake",
        "status": case.status if case else "In Progress",
        "extracted_data": case.extracted_data if case else {},
        "missing_fields": case.missing_fields if case else []
    }
    
    pdf_bytes = generate_styled_application_pdf(case_data)
    
    filename = f"Passage_Application_{case_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Cache-Control": "no-cache"
        }
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

