import json
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

def extract_entities_with_llm(raw_text: str, schema: dict) -> dict:
    """
    Sends the raw text and JSON Schema to OpenAI to extract fields dynamically.
    """
    if not client:
        print("No OpenAI API Key found, using mock implementation.")
        return mock_extraction()
        
    try:
        fields_description = json.dumps(schema.get("required_fields", []))
        
        system_prompt = (
            "You are an expert data extraction assistant. "
            "Extract the requested information from the provided document text according to the following fields: "
            f"{fields_description}\n\n"
            "CRITICAL INSTRUCTION: If the schema requires separate fields for 'first/given name' and 'last/family name', but the text provides them together, you MUST separate them accurately.\n\n"
            "Return a JSON object with EXACTLY two top-level keys:\n"
            "1. 'extracted_data': A dictionary where keys are field names (use the 'name' from the fields) and values are the extracted values (or null if missing).\n"
            "2. 'confidence_scores': A dictionary matching the keys of extracted_data with float values between 0.0 and 1.0 indicating your confidence."
        )
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_text}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        
        result_json = response.choices[0].message.content
        return json.loads(result_json)
    except Exception as e:
        print(f"Extraction error: {e}")
        return mock_extraction()

def process_chat_message_with_llm(message: str, case_state: dict, schema: dict) -> dict:
    """
    Analyzes user message to extract target country, visa type, new form entities, and generate the next agent prompt.
    Leverages the verified Unified Applicant Profile while enforcing strict anti-hallucination guardrails.
    """
    if not client:
        return mock_chat_response(message)
        
    try:
        missing_fields = case_state.get("missing_fields", [])
        extracted_data = case_state.get("extracted_data", {})
        unified_profile = case_state.get("unified_profile", {})
        target_country = case_state.get("target_country")
        visa_type = case_state.get("visa_type")
        schema_fields = schema.get("required_fields", [])
        fields_description = json.dumps(schema_fields)
        
        has_country = target_country and target_country not in ["GENERIC", "Unspecified", ""]
        
        system_prompt = (
            "You are an intelligent, professional immigration intake AI assistant.\n\n"
            "APPLICATION CONTEXT:\n"
            f"- Target Country: {target_country if has_country else 'Not yet specified'}\n"
            f"- Visa Pathway/Type: {visa_type if visa_type and visa_type != 'GENERIC' else 'Not yet specified'}\n"
            f"- Required Fields Schema: {fields_description}\n"
            f"- Currently Saved Data For This Application: {json.dumps(extracted_data)}\n"
            f"- Verified Unified Applicant Profile (Cross-Application Data): {json.dumps(unified_profile)}\n"
            f"- Still Missing Required Fields: {json.dumps(missing_fields)}\n\n"
            "INTELLIGENCE & PRE-FILLING DIRECTIVES:\n"
            "1. UNIFIED PROFILE UTILIZATION:\n"
            "   - Use verified data from the 'Unified Applicant Profile' to reduce manual input.\n"
            "   - If the applicant starts a new application and their unified profile already contains verified fields (e.g., Name, Date of Birth, Passport Number, Email, etc.), acknowledge this politely so they don't have to re-enter them!\n"
            "2. STRICT ANTI-HALLUCINATION GUARDRAILS:\n"
            "   - NEVER fabricate, invent, assume, or guess any dates, test scores (e.g. IELTS), credentials, passport numbers, or job titles.\n"
            "   - ONLY use facts that are explicitly written in 'Currently Saved Data', 'Verified Unified Applicant Profile', or the user's latest message.\n"
            "   - If a required field is not explicitly present in the data, you MUST consider it missing and prompt the user for it directly.\n"
            "3. COUNTRY & VISA INTAKE:\n"
            "   - If Target Country is not yet specified, analyze if the user's message mentions a destination country or visa pathway. If detected, populate 'target_country' and/or 'visa_type'.\n"
            "   - If unknown, ask which country they want to apply to.\n"
            "4. FORM DATA EXTRACTION:\n"
            "   - Extract any personal/application details for fields in the schema.\n"
            "   - If user gives a full name (e.g. 'Ahmed Khan'), split into separate First Name / Last Name or Given Name / Family Name matching the schema field names.\n"
            "   - Keys in 'new_extracted_data' MUST match the exact 'name' string from the schema.\n"
            "5. CONVERSATIONAL REPLY:\n"
            "   - Acknowledge provided/pre-filled details, and focus directly on asking for the NEXT missing required field.\n"
            "   - If all required fields are complete, confirm readiness for review.\n\n"
            "Respond in JSON format with EXACTLY these keys:\n"
            "{\n"
            "  \"target_country\": \"<Country name or null>\",\n"
            "  \"visa_type\": \"<Visa type or null>\",\n"
            "  \"new_extracted_data\": { ... },\n"
            "  \"reply\": \"...\"\n"
            "}"
        )
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        result_json = response.choices[0].message.content
        return json.loads(result_json)
    except Exception as e:
        print(f"Chat error: {e}")
        return mock_chat_response(message)

def mock_extraction():
    return {
        "extracted_data": {
            "Given Name": "Alexander",
            "Family Name": "Mercer",
            "Passport Number": "A12345678",
            "Total Years Experience": 4.5
        },
        "confidence_scores": {
            "Given Name": 0.95,
            "Family Name": 0.90,
            "Passport Number": 0.99,
            "Total Years Experience": 0.88
        }
    }

def parse_form_fields_from_document_with_llm(raw_text: str) -> dict:
    """
    Analyzes raw text extracted via Tesseract OCR from an uploaded guidelines or form document,
    and extracts country name, visa category, and structured form requirement fields.
    """
    import uuid
    default_fields = [
        {"id": str(uuid.uuid4())[:8], "name": "First Name", "type": "text", "required": True},
        {"id": str(uuid.uuid4())[:8], "name": "Last Name", "type": "text", "required": True},
        {"id": str(uuid.uuid4())[:8], "name": "Date of Birth", "type": "date", "required": True},
        {"id": str(uuid.uuid4())[:8], "name": "Passport Number", "type": "text", "required": True},
        {"id": str(uuid.uuid4())[:8], "name": "Email", "type": "email", "required": True},
        {"id": str(uuid.uuid4())[:8], "name": "Employment Status", "type": "text", "required": False},
    ]

    if not client or not raw_text.strip():
        return {
            "country_code": None,
            "visa_type": None,
            "summary": "Extracted standard template fields",
            "fields": default_fields
        }
        
    try:
        system_prompt = (
            "You are an expert immigration form schema generator. Analyze the provided OCR text extracted from an official visa application form, screenshot, or guideline document.\n\n"
            "Identify the destination country, the visa type/subclass if mentioned, and extract a comprehensive list of all required and optional input fields an applicant must provide.\n\n"
            "Return a JSON object with EXACTLY these keys:\n"
            "1. 'country_code': string (e.g. 'Canada', 'Germany', 'United States', 'Australia', 'United Kingdom', etc. or null if unknown)\n"
            "2. 'visa_type': string (e.g. 'Express Entry', 'Opportunity Card', 'O-1 Alien of Extraordinary Ability', 'Student Visa', etc. or null if unknown)\n"
            "3. 'summary': a brief 1-sentence description of the form\n"
            "4. 'fields': an array of field objects with keys:\n"
            "   - 'id': short unique alphanumeric string\n"
            "   - 'name': clear descriptive field name (e.g. 'First Name', 'Passport Number', 'Monthly Income', 'IELTS Overall Band', etc.)\n"
            "   - 'type': one of ['text', 'number', 'date', 'email', 'file']\n"
            "   - 'required': boolean (true for mandatory fields, false for optional fields)"
        )
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_text[:9000]}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        data = json.loads(response.choices[0].message.content)
        fields = data.get("fields", [])
        
        # Ensure unique IDs
        for f in fields:
            if not f.get("id"):
                f["id"] = str(uuid.uuid4())[:8]
                
        return {
            "country_code": data.get("country_code"),
            "visa_type": data.get("visa_type"),
            "summary": data.get("summary", "Document parsed successfully"),
            "fields": fields if fields else default_fields
        }
    except Exception as e:
        print(f"Error parsing form fields with OCR + LLM: {e}")
        return {
            "country_code": None,
            "visa_type": None,
            "summary": "Fallback default template",
            "fields": default_fields
        }

def mock_chat_response(message):
    return {
        "new_extracted_data": {},
        "reply": "I'm having trouble connecting to my AI brain. Could you provide your next missing field?"
    }

