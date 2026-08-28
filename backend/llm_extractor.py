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

from seed_data import IMMIGRATION_KNOWLEDGE_BASE

def process_chat_message_with_llm(message: str, case_state: dict, schema: dict, chat_history: list = None) -> dict:
    """
    Analyzes user message with full conversation history context to extract target country, visa type,
    new form entities, and generate the next agent prompt.
    Leverages the verified Unified Applicant Profile while enforcing strict anti-hallucination and anti-redundancy guardrails.
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
        
        has_country = bool(target_country and target_country not in ["GENERIC", "Unspecified", "null", "None", ""])
        has_visa = bool(visa_type and visa_type not in ["GENERIC", "General", "null", "None", ""])
        
        country_status_directive = ""
        if has_country and has_visa:
            country_status_directive = (
                f"- ALREADY CONFIRMED: Target Country is '{target_country}' and Visa Pathway is '{visa_type}'.\n"
                f"- CRITICAL: DO NOT ASK the applicant which country or visa they want to apply for. It is already locked in.\n"
                f"- If the applicant asks questions about their pathway, requirements, or documents, answer accurately from the knowledge base.\n"
                f"- Otherwise, guide the applicant directly to complete the remaining missing required fields."
            )
        elif has_country:
            country_status_directive = (
                f"- ALREADY CONFIRMED: Target Country is '{target_country}'.\n"
                f"- CRITICAL: DO NOT ASK for the country name again.\n"
                f"- If the applicant asks what visa options or pathways exist for {target_country}, present the top visa options from the Knowledge Base with concise bullet points.\n"
                f"- If the visa pathway/category is not yet specified, you may ask which visa type they prefer or proceed with general requirements for {target_country}."
            )
        else:
            country_status_directive = (
                "- Target Country is NOT yet confirmed.\n"
                "- If the applicant asks what countries or visa options are available, or what suits their background, provide a helpful summary of top destinations (e.g. Canada, Germany, United States, UK, Australia, UAE) and their popular pathways.\n"
                "- If they mention any country or visa in their message, extract it immediately into 'target_country' and 'visa_type' and acknowledge it enthusiastically.\n"
                "- If no country has been mentioned yet and they are just saying hello, politely ask which destination country they are considering or offer top options."
            )

        kb_summary = json.dumps(IMMIGRATION_KNOWLEDGE_BASE, indent=2)

        system_prompt = (
            "You are an alert, highly informed, empathetic, and professional immigration intake AI assistant.\n\n"
            "IMMIGRATION KNOWLEDGE BASE (OFFICIAL DESTINATIONS & PATHWAYS):\n"
            f"{kb_summary}\n\n"
            "APPLICATION STATE & CONTEXT:\n"
            f"- Target Country: {target_country if has_country else 'Not yet specified'}\n"
            f"- Visa Pathway/Type: {visa_type if has_visa else 'Not yet specified'}\n"
            f"- Required Fields Schema: {fields_description}\n"
            f"- Currently Saved Data For This Application: {json.dumps(extracted_data)}\n"
            f"- Verified Unified Applicant Profile (Cross-Application Data): {json.dumps(unified_profile)}\n"
            f"- Still Missing Required Fields: {json.dumps(missing_fields)}\n\n"
            "COUNTRY & VISA RETENTION DIRECTIVES:\n"
            f"{country_status_directive}\n\n"
            "INTELLIGENCE & ADVISORY DIRECTIVES:\n"
            "1. ALERT & INFORMED ADVISORY:\n"
            "   - When the user asks for options, advice, or comparisons (e.g. 'What countries do you support?', 'What options do I have for Germany?', 'What visa is good for a software engineer?', 'What are the requirements for Canada Express Entry?'), use the IMMIGRATION KNOWLEDGE BASE above to provide clear, actionable bullet points.\n"
            "   - Highlight key eligibility points and required documents.\n"
            "2. NO FORGETFULNESS & NO REPETITIVE QUESTIONS:\n"
            "   - NEVER ask for information that the client has already told you or that is stored in 'Currently Saved Data' or 'Verified Unified Applicant Profile'.\n"
            "   - If the user says their name, date of birth, passport, job, or destination anywhere in chat, remember and extract it permanently.\n"
            "3. UNIFIED PROFILE UTILIZATION:\n"
            "   - Use verified data from the 'Unified Applicant Profile' to reduce manual input.\n"
            "   - Acknowledge pre-filled fields so the applicant does not have to re-enter them.\n"
            "4. STRICT ANTI-HALLUCINATION GUARDRAILS:\n"
            "   - NEVER fabricate applicant personal details (dates, scores, passport numbers).\n"
            "   - ONLY extract facts explicitly provided by the user.\n"
            "5. FORM DATA EXTRACTION:\n"
            "   - Extract any personal/application details for fields in the schema.\n"
            "   - If user gives a full name (e.g. 'Ahmed Khan'), split into separate First Name / Last Name or Given Name / Family Name matching the schema field names.\n"
            "   - Keys in 'new_extracted_data' MUST match the exact 'name' string from the schema.\n"
            "6. CONVERSATIONAL REPLY:\n"
            "   - Be sharp, warm, and proactive. Answer any user questions directly, then ask for the NEXT missing required field with clear examples.\n"
            "   - If all required fields are complete, confirm readiness for application dossier generation and review!\n\n"
            "Respond in JSON format with EXACTLY these keys:\n"
            "{\n"
            f"  \"target_country\": \"<{target_country if has_country else 'Extracted country name or null'}>\",\n"
            f"  \"visa_type\": \"<{visa_type if has_visa else 'Extracted visa type or null'}>\",\n"
            "  \"new_extracted_data\": { ... },\n"
            "  \"reply\": \"...\"\n"
            "}"
        )
        
        # Assemble message list with recent chat history (up to last 12 turns)
        messages_payload = [{"role": "system", "content": system_prompt}]
        if chat_history and isinstance(chat_history, list):
            # Take last 12 history items
            recent_history = chat_history[-12:]
            for turn in recent_history:
                role = "assistant" if turn.get("role") in ["agent", "assistant"] else "user"
                text = turn.get("text") or turn.get("content") or ""
                if text.strip():
                    messages_payload.append({"role": role, "content": text})
                    
        # Append current user message
        messages_payload.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages_payload,
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        result_json = response.choices[0].message.content
        parsed = json.loads(result_json)
        
        # Ensure country/visa don't get erased if already established
        if has_country and (not parsed.get("target_country") or parsed.get("target_country") in ["null", "None", "Unspecified"]):
            parsed["target_country"] = target_country
        if has_visa and (not parsed.get("visa_type") or parsed.get("visa_type") in ["null", "None", "General"]):
            parsed["visa_type"] = visa_type
            
        return parsed
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

