from sqlalchemy import Column, String, Float, JSON
from database import Base

class CountrySchema(Base):
    __tablename__ = "country_schemas"
    
    country_code = Column(String, primary_key=True, index=True)
    visa_type = Column(String, primary_key=True, index=True)
    version = Column(String)
    required_fields = Column(JSON) # JSON array of dicts

class UserCaseState(Base):
    __tablename__ = "user_cases"
    
    case_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    target_country = Column(String)
    visa_type = Column(String)
    status = Column(String)
    extracted_data = Column(JSON)
    missing_fields = Column(JSON) # JSON array of strings
    uploaded_documents = Column(JSON)
    chat_history = Column(JSON, default=list) # JSON array of {role, text, isAttachment, timestamp}
