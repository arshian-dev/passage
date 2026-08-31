"""
Immigration Knowledge Base & Default Schema Seeder
Provides comprehensive, verified domain knowledge about countries, official visa pathways,
eligibility criteria, required documents, and government form schemas.
Covers Canada, Germany, United States, United Kingdom, Australia, UAE, Singapore, and France.
Enforces consistent standard field naming across all forms for cross-application pre-filling.
"""

from typing import Dict, List, Any

IMMIGRATION_KNOWLEDGE_BASE: Dict[str, Any] = {
    "Canada": {
        "description": "Leading destination for skilled professionals, international students, and entrepreneurs with a points-based immigration system.",
        "visa_pathways": [
            {
                "name": "Express Entry (Federal Skilled Worker / CEC)",
                "description": "Points-based Comprehensive Ranking System (CRS) for skilled professionals and Canadian Experience Class applicants.",
                "eligibility": "Minimum 1 year continuous full-time skilled work experience (NOC TEER 0, 1, 2, or 3), language proficiency (CLB 7+ in IELTS or CELPIP), Educational Credential Assessment (ECA) for foreign degrees, score 67+ on FSW selection grid.",
                "key_documents": ["Passport", "ECA Report (WES/ICES)", "IELTS/CELPIP Language Scores", "Employment Reference Letters", "Police Clearance Certificate", "Proof of Settlement Funds (CAD $14,690+ for single applicant)"]
            },
            {
                "name": "Study Permit & PGWP Pathway",
                "description": "For studying at a Canadian Designated Learning Institution (DLI) leading to up to 3 years Post-Graduation Work Permit (PGWP).",
                "eligibility": "Official Letter of Acceptance from DLI, proof of funds (CAD $20,635+ living expenses + first-year tuition), clean criminal and medical background, intention to depart at permit expiration.",
                "key_documents": ["Letter of Acceptance (LOA)", "Proof of Financial Support / GIC Receipt", "Valid Passport", "Statement of Purpose (SOP)", "Language Scores (IELTS/TOEFL/PTE)"]
            },
            {
                "name": "Provincial Nominee Program (PNP)",
                "description": "For applicants with skills, education, or work experience targeted by specific Canadian provinces (e.g. Ontario OINP, BC PNP, Alberta AAIP).",
                "eligibility": "Meets specific provincial labor market criteria, valid provincial nomination certificate, provincial job offer or local in-demand occupation.",
                "key_documents": ["Provincial Nomination Certificate", "Job Offer Letter", "Skill & Credential Assessment", "Proof of Ties to Province", "Proof of Funds"]
            },
            {
                "name": "Visitor Visa / Super Visa (IMM 5257)",
                "description": "Temporary Resident Visa (TRV) for tourism, family visits, or parent/grandparent extended stays (Super Visa).",
                "eligibility": "Valid passport, proof of ties to home country (employment, property), sufficient funds for duration of visit, medical insurance (for Super Visa).",
                "key_documents": ["Form IMM 5257", "Valid Passport", "Bank Statements (Past 6 Months)", "Travel Itinerary / Flight Reservation", "Invitation Letter & Host Financials"]
            }
        ]
    },
    "Germany": {
        "description": "Europe's economic powerhouse offering points-based opportunity cards, EU Blue Cards, and fast-track skilled immigration.",
        "visa_pathways": [
            {
                "name": "Opportunity Card (Chancenkarte)",
                "description": "Points-based search-for-work card allowing a 1-year stay in Germany to secure qualified employment (up to 20h/week part-time work permitted).",
                "eligibility": "State-recognized degree or 2+ year vocational training + German A1 or English B2, scoring at least 6 points on age, qualifications, language, experience, and German ties.",
                "key_documents": ["Degree / Vocational Certificate (ZAB Anabin recognized)", "Language Certificate (Goethe/TestDaF/IELTS/TOEFL)", "Blocked Account (€12,324 minimum) or Declaration of Commitment", "Detailed European Format CV & Motivation Letter"]
            },
            {
                "name": "EU Blue Card Germany",
                "description": "Premium work & residency permit for university graduates, IT specialists, engineers, and doctors with accelerated permanent residency (in as little as 21-27 months).",
                "eligibility": "Recognized higher education degree + binding German job offer meeting annual gross salary threshold (€45,300 standard or €41,041 for STEM / shortage occupations in 2024+).",
                "key_documents": ["German Employment Contract", "Declaration of Employment (Erklärung zum Beschäftigungsverhältnis)", "ZAB Degree Equivalence / Statement of Comparability", "Valid Passport"]
            },
            {
                "name": "Skilled Worker Visa (Section 18a/18b AufenthG)",
                "description": "For qualified professionals with vocational training or degrees recognized in Germany.",
                "eligibility": "Concrete job offer in a qualified profession + official recognition notice (Anerkennungsbescheid) from competent German certification body.",
                "key_documents": ["Definitive Recognition Notice", "Employment Contract", "Proof of German Language Proficiency (B1/B2)", "Valid Passport"]
            },
            {
                "name": "Student & Academic Visa (Section 16b)",
                "description": "For full-time university studies or preparatory German language courses.",
                "eligibility": "Admission letter from a German higher education institution, proof of financial resources (€11,208/year blocked account), statutory German health insurance.",
                "key_documents": ["University Admission Letter (Zulassungsbescheid)", "Blocked Account Confirmation", "Proof of Previous Academic Degrees", "Health Insurance Confirmation"]
            }
        ]
    },
    "United States": {
        "description": "Global center for technology, science, business, higher education, and international travel.",
        "visa_pathways": [
            {
                "name": "B-1 / B-2 Visitor Visa",
                "description": "Non-immigrant visa for temporary business (B-1), tourism, visiting family, or medical treatment (B-2).",
                "eligibility": "Demonstrate strong economic and family ties to home country, sufficient financial resources for US stay, valid passport, non-immigrant intent.",
                "key_documents": ["Form DS-160 Confirmation", "Valid Passport", "Proof of Funds / Bank Statements", "Travel Itinerary / Letter of Invitation", "Proof of Home Country Ties (Employment/Property)"]
            },
            {
                "name": "O-1 Extraordinary Ability Visa",
                "description": "Non-immigrant visa for individuals with extraordinary ability in sciences, arts, education, business, or athletics.",
                "eligibility": "Sustained national or international acclaim, meeting at least 3 of 8 regulatory criteria (major awards, publications, high salary, peer judging, critical leadership roles, significant original contributions, press coverage).",
                "key_documents": ["Peer Consultation / Advisory Opinion Letter", "Evidence of Significant Contributions (Patents/Citations)", "Media Articles & Press", "Letters of Recommendation from Experts", "US Petitioner / Agent Agreement & Form I-129"]
            },
            {
                "name": "H-1B Specialty Occupation",
                "description": "For professionals in specialty occupations requiring theoretical and practical application of specialized knowledge (Bachelor's degree minimum).",
                "eligibility": "Job offer from a US employer in a specialty occupation, bachelor's degree or foreign equivalent, employer files Labor Condition Application (LCA) and USCIS petition.",
                "key_documents": ["Certified Form ETA-9035 (LCA)", "Form I-129 / Form I-797 Approval Notice", "Foreign Academic Credential Evaluation", "Resume & Job Description"]
            },
            {
                "name": "EB-2 National Interest Waiver (NIW)",
                "description": "Direct Green Card immigrant petition self-petitionable without an employer sponsor or PERM labor certification.",
                "eligibility": "Advanced degree (Master's/PhD) or exceptional ability + proposed endeavor has substantial merit and national importance, applicant is well positioned to advance it, and on balance it is beneficial to the US to waive job offer.",
                "key_documents": ["Form I-140", "Comprehensive Endeavor Statement", "Expert Testimonial Letters", "Scholarly Citations / Grants / Commercial Impact Evidence"]
            },
            {
                "name": "F-1 Student Visa & STEM OPT",
                "description": "For full-time academic studies with up to 3 years optional practical training (OPT) work authorization for STEM fields.",
                "eligibility": "Acceptance at SEVP-certified school, Form I-20, proof of financial ability to cover tuition & living expenses, non-immigrant intent.",
                "key_documents": ["Form I-20", "SEVIS Fee Receipt (I-901)", "DS-160 Confirmation", "Financial Statements"]
            },
            {
                "name": "L-1 Intracompany Transferee",
                "description": "For transferring executive/managerial personnel (L-1A) or specialized knowledge staff (L-1B) from a foreign affiliate to a US entity.",
                "eligibility": "At least 1 continuous year of employment with foreign parent/branch/affiliate within past 3 years, qualifying corporate relationship.",
                "key_documents": ["Form I-129 L Supplement", "Corporate Organizational Chart", "Evidence of Qualifying Relationship", "Proof of Continuous 1-Year Foreign Employment"]
            }
        ]
    },
    "United Kingdom": {
        "description": "Points-based immigration system for skilled professionals, global innovators, and international students.",
        "visa_pathways": [
            {
                "name": "Skilled Worker Visa",
                "description": "Work in an eligible job with an approved Home Office licensed sponsor employer.",
                "eligibility": "Valid Certificate of Sponsorship (CoS) from a licensed UK employer, eligible SOC occupation code, meeting general salary threshold (minimum £38,700 or going rate), English B1 (IELTS for UKVI).",
                "key_documents": ["Certificate of Sponsorship (CoS)", "Proof of English (SELT / Ecctis)", "Valid Passport", "Criminal Record Certificate", "Tuberculosis Test Results (if applicable)"]
            },
            {
                "name": "Global Talent Visa",
                "description": "Work in the UK for leaders and emerging leaders in digital technology, academia, research, arts, and culture (no sponsor employer required).",
                "eligibility": "Endorsement by designated endorsement body (Tech Nation / Founders Forum, British Academy, Royal Society, Arts Council England) or holding an eligible prestigious prize.",
                "key_documents": ["Official Endorsement Letter", "CV and 3 Recommendation Letters from Industry Leaders", "Evidence of Significant Track Record & Innovation"]
            },
            {
                "name": "Student Visa & Graduate Route",
                "description": "Study at a licensed student sponsor university, with an automatic 2-year (3-year PhD) unsponsored post-study work visa.",
                "eligibility": "Confirmation of Acceptance for Studies (CAS), proof of financial maintenance funds (living costs £1,334/month London, £1,023/month outside), English proficiency B2.",
                "key_documents": ["CAS Statement", "Proof of Funds (28-day bank statement)", "ATAS Certificate (if required)", "Passport"]
            },
            {
                "name": "UK Standard Visitor Visa",
                "description": "For tourism, visiting family and friends, attending business meetings or conferences (up to 6 months).",
                "eligibility": "Proof of intention to leave the UK at the end of visit, proof of sufficient funds to support stay, proof of accommodation and travel plans.",
                "key_documents": ["Valid Passport", "Bank Statements (6 Months)", "Employment Verification / Pay Slips", "Travel Itinerary", "Invitation Letter (if visiting friends/family)"]
            }
        ]
    },
    "Australia": {
        "description": "Points-tested General Skilled Migration and employer-sponsored programs with direct permanent residency avenues.",
        "visa_pathways": [
            {
                "name": "Subclass 189 / 190 Skilled Independent / Nominated Visa",
                "description": "Permanent residence visa for points-tested skilled workers invited through SkillSelect.",
                "eligibility": "Occupation on Skilled Occupation List (MLTSSL/STSOL), positive Skills Assessment, scoring 65+ points (age, English, qualification, experience), Competent English (IELTS 6.0+), under 45 years.",
                "key_documents": ["Skills Assessment Outcome (ACS, Engineers Australia, VETASSESS)", "IELTS / PTE Academic Score Report", "Expression of Interest (EOI) Lodgement", "Passport"]
            },
            {
                "name": "Subclass 482 Temporary Skill Shortage (TSS)",
                "description": "Allows employers to sponsor skilled workers for up to 4 years when Australian workers cannot be sourced.",
                "eligibility": "Nomination by approved standard business sponsor, at least 2 years relevant work experience in nominated occupation, meeting TSMIT salary requirements.",
                "key_documents": ["Employer Nomination Approval", "Employment References & Pay Slips", "English Test Results", "Valid Passport"]
            },
            {
                "name": "Student Visa (Subclass 500) & Subclass 485 Temporary Graduate",
                "description": "Full-time study at a registered CRICOS provider followed by post-study work rights.",
                "eligibility": "Confirmation of Enrolment (CoE), Genuine Student (GS) requirement, proof of funds (AUD $29,710/year living costs), Overseas Student Health Cover (OSHC).",
                "key_documents": ["Confirmation of Enrolment (CoE)", "Genuine Student Statement", "Financial Proof", "OSHC Policy", "Valid Passport"]
            },
            {
                "name": "Subclass 600 Visitor Visa",
                "description": "Tourist and business visitor stream allowing stays of up to 3, 6, or 12 months.",
                "eligibility": "Genuine visitor intent, sufficient funds for stay in Australia, valid passport, meeting health and character requirements.",
                "key_documents": ["Valid Passport", "Bank Statements & Proof of Income", "Travel Itinerary", "Employment / Leave Approval Letter"]
            }
        ]
    },
    "United Arab Emirates (UAE)": {
        "description": "Tax-free living, world-class infrastructure, and long-term residency options for professionals, investors, and talent.",
        "visa_pathways": [
            {
                "name": "UAE Golden Visa (10-Year Long-Term Residence)",
                "description": "10-year renewable residency without needing a local national sponsor employer.",
                "eligibility": "Skilled professionals with monthly salary AED 30,000+ (bachelor's degree required), exceptional talents, PhD holders, coders, or real estate investors (AED 2M+).",
                "key_documents": ["Attested University Degree", "Salary Certificate & 6-Month Bank Statements", "Valid UAE Employment Contract", "Passport & Emirates ID"]
            },
            {
                "name": "Green Visa for Skilled Employees (5-Year)",
                "description": "5-year self-sponsored residency for skilled professionals and freelancers.",
                "eligibility": "Valid employment contract, classified in 1st/2nd/3rd occupational level by MOHRE, bachelor's degree or equivalent, monthly salary AED 15,000+.",
                "key_documents": ["MOHRE Contract", "Attested Degree", "Proof of Salary", "Passport"]
            },
            {
                "name": "Remote Work / Virtual Working Visa (1-Year)",
                "description": "1-year residency permit allowing foreign remote employees and business owners to live in UAE while working for overseas companies.",
                "eligibility": "Proof of employment with foreign company or business ownership, minimum monthly income of USD $3,500+, valid health insurance with UAE coverage.",
                "key_documents": ["Employment Contract / Proof of Company Ownership", "Past 3 Months Bank Statements", "Valid Passport", "Health Insurance Policy"]
            }
        ]
    },
    "Singapore": {
        "description": "Asia's premier financial and technology hub offering streamlined talent passes and employment passes.",
        "visa_pathways": [
            {
                "name": "Employment Pass (EP) & COMPASS",
                "description": "Work pass for foreign managers, executives, and specialized professionals earning at least SGD $5,600/month (SGD $6,200 for financial services).",
                "eligibility": "Job offer in Singapore, meeting minimum salary benchmarks and scoring 40+ points on the Complementarity Assessment Framework (COMPASS).",
                "key_documents": ["Singapore Job Offer & Employment Contract", "Attested Educational Certificates / Verification Proof", "Candidate Resume", "Valid Passport"]
            },
            {
                "name": "Tech.Pass / ONE Pass",
                "description": "Premium work pass for global tech leaders, founders, and top talent allowing flexible business and employment activities.",
                "eligibility": "Earning monthly salary of SGD $22,500+ in past year OR leadership experience in tech company with valuation USD $500M+.",
                "key_documents": ["Proof of Salary / Tax Assessment", "Track Record Evidence (Product Leadership / Capital Raised)", "CV & Recommendations", "Passport"]
            }
        ]
    },
    "France": {
        "description": "Gateway to the European Union offering multi-year Talent Passports for qualified professionals, founders, and researchers.",
        "visa_pathways": [
            {
                "name": "Talent Passport (Passeport Talent)",
                "description": "4-year renewable residence permit for highly qualified employees, startup founders, investors, and researchers with family accompaniment rights.",
                "eligibility": "Master's degree or equivalent + French employment contract with gross annual salary of at least €41,933, or qualifying innovative startup endeavor.",
                "key_documents": ["CERFA 15614 Form", "French Employment Contract (Contrat de Travail)", "Master's Degree Diploma", "Valid Passport"]
            }
        ]
    }
}

# Standardized field name dictionary for consistent cross-form normalization
STANDARD_FIELD_NAME_MAP = {
    # First Name
    "us_fn": "First Name", "can_fn": "First Name", "cst_fn": "First Name", "de_fn": "First Name",
    "deb_fn": "First Name", "h1_fn": "First Name", "uk_fn": "First Name", "au_fn": "First Name",
    "uae_fn": "First Name", "gen_fn": "First Name", "b2_fn": "First Name", "first_name": "First Name",
    "given_name": "First Name", "firstname": "First Name", "us fn": "First Name",
    
    # Last Name
    "us_ln": "Last Name", "can_ln": "Last Name", "cst_ln": "Last Name", "de_ln": "Last Name",
    "deb_ln": "Last Name", "h1_ln": "Last Name", "uk_ln": "Last Name", "au_ln": "Last Name",
    "uae_ln": "Last Name", "gen_ln": "Last Name", "b2_ln": "Last Name", "last_name": "Last Name",
    "family_name": "Last Name", "surname": "Last Name", "lastname": "Last Name", "us ln": "Last Name",
    
    # Date of birth
    "us_dob": "Date of Birth", "can_dob": "Date of Birth", "cst_dob": "Date of Birth", "de_dob": "Date of Birth",
    "deb_dob": "Date of Birth", "h1_dob": "Date of Birth", "uk_dob": "Date of Birth", "au_dob": "Date of Birth",
    "uae_dob": "Date of Birth", "gen_dob": "Date of Birth", "b2_dob": "Date of Birth", "dob": "Date of Birth",
    "date_of_birth": "Date of Birth", "birth_date": "Date of Birth", "us dob": "Date of Birth",
    
    # Passport Number
    "us_pass": "Passport Number", "can_pass": "Passport Number", "cst_pass": "Passport Number", "de_pass": "Passport Number",
    "deb_pass": "Passport Number", "h1_pass": "Passport Number", "uk_pass": "Passport Number", "au_pass": "Passport Number",
    "uae_pass": "Passport Number", "gen_pass": "Passport Number", "b2_pass": "Passport Number", "passport": "Passport Number",
    "passport_number": "Passport Number", "passport_no": "Passport Number", "us pass": "Passport Number",
    
    # Email
    "us_email": "Email", "can_email": "Email", "cst_email": "Email", "de_email": "Email",
    "deb_email": "Email", "h1_email": "Email", "uk_email": "Email", "au_email": "Email",
    "uae_email": "Email", "gen_email": "Email", "b2_email": "Email", "email_address": "Email",
    "email": "Email", "us email": "Email",
    
    # Phone Number
    "can_phone": "Phone Number", "gen_phone": "Phone Number", "b2_phone": "Phone Number",
    "phone": "Phone Number", "phone_number": "Phone Number", "telephone": "Phone Number",
    
    # Aliased O-1 / US fields
    "us_field": "Field of Extraordinary Ability", "us field": "Field of Extraordinary Ability",
    "us_pet": "US Petitioner / Sponsor Entity Name", "us pet": "US Petitioner / Sponsor Entity Name",
    "us_awards": "Major Awards or Distinctions", "us awards": "Major Awards or Distinctions",
    "us_pubs": "Scholarly Publications / Patents Count", "us pubs": "Scholarly Publications / Patents Count",
    "us_comp": "Expected Annual Compensation ($)", "us comp": "Expected Annual Compensation ($)"
}

SEED_SCHEMAS = [
    # -------------------------------------------------------------
    # CANADA
    # -------------------------------------------------------------
    {
        "country_code": "Canada",
        "visa_type": "Express Entry",
        "version": "1.0",
        "required_fields": [
            {"id": "can_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "can_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "can_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "can_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "can_email", "name": "Email", "type": "email", "required": True},
            {"id": "can_phone", "name": "Phone Number", "type": "text", "required": False},
            {"id": "can_edu", "name": "Highest Education Level", "type": "text", "required": True},
            {"id": "can_noc", "name": "Primary NOC Code / Job Title", "type": "text", "required": True},
            {"id": "can_exp", "name": "Total Years of Skilled Experience", "type": "number", "required": True},
            {"id": "can_ielts", "name": "IELTS / CELPIP Scores", "type": "text", "required": True},
            {"id": "can_funds", "name": "Settlement Funds Available (CAD)", "type": "number", "required": False}
        ]
    },
    {
        "country_code": "Canada",
        "visa_type": "Study Permit",
        "version": "1.0",
        "required_fields": [
            {"id": "cst_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "cst_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "cst_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "cst_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "cst_email", "name": "Email", "type": "email", "required": True},
            {"id": "cst_dli", "name": "Designated Learning Institution (DLI) Name", "type": "text", "required": True},
            {"id": "cst_prog", "name": "Program of Study", "type": "text", "required": True},
            {"id": "cst_dur", "name": "Program Duration (Years)", "type": "number", "required": True},
            {"id": "cst_gic", "name": "GIC / Financial Proof Amount (CAD)", "type": "number", "required": True}
        ]
    },
    {
        "country_code": "Canada",
        "visa_type": "Visitor Visa (IMM 5257)",
        "version": "1.0",
        "required_fields": [
            {"id": "can_v_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "can_v_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "can_v_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "can_v_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "can_v_email", "name": "Email", "type": "email", "required": True},
            {"id": "can_v_purpose", "name": "Purpose of Travel to Canada", "type": "text", "required": True},
            {"id": "can_v_stay", "name": "Intended Duration of Stay (Days)", "type": "number", "required": True},
            {"id": "can_v_funds", "name": "Available Funds for Visit (CAD)", "type": "number", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # GERMANY
    # -------------------------------------------------------------
    {
        "country_code": "Germany",
        "visa_type": "Opportunity Card",
        "version": "1.0",
        "required_fields": [
            {"id": "de_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "de_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "de_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "de_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "de_email", "name": "Email", "type": "email", "required": True},
            {"id": "de_degree", "name": "Degree / Professional Qualification", "type": "text", "required": True},
            {"id": "de_lang", "name": "German / English Language Level", "type": "text", "required": True},
            {"id": "de_exp", "name": "Years of Professional Experience", "type": "number", "required": True},
            {"id": "de_funds", "name": "Blocked Account / Proof of Funds Amount (€)", "type": "number", "required": True}
        ]
    },
    {
        "country_code": "Germany",
        "visa_type": "EU Blue Card",
        "version": "1.0",
        "required_fields": [
            {"id": "deb_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "deb_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "deb_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "deb_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "deb_email", "name": "Email", "type": "email", "required": True},
            {"id": "deb_title", "name": "German Job Offer Title", "type": "text", "required": True},
            {"id": "deb_salary", "name": "Annual Gross Salary (€)", "type": "number", "required": True},
            {"id": "deb_deg", "name": "University Degree Title", "type": "text", "required": True},
            {"id": "deb_emp", "name": "Employer Name in Germany", "type": "text", "required": True}
        ]
    },
    {
        "country_code": "Germany",
        "visa_type": "Skilled Worker Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "des_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "des_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "des_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "des_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "des_email", "name": "Email", "type": "email", "required": True},
            {"id": "des_job", "name": "Concrete Job Offer Title", "type": "text", "required": True},
            {"id": "des_rec", "name": "Official Recognition Notice (Anerkennungsbescheid)", "type": "text", "required": True},
            {"id": "des_sal", "name": "Monthly Salary (€)", "type": "number", "required": True},
            {"id": "des_ger", "name": "German Language Certificate Level", "type": "text", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # UNITED STATES
    # -------------------------------------------------------------
    {
        "country_code": "United States",
        "visa_type": "B-2 Tourist Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "b2_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "b2_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "b2_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "b2_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "b2_email", "name": "Email", "type": "email", "required": True},
            {"id": "b2_phone", "name": "Phone Number", "type": "text", "required": False},
            {"id": "b2_purpose", "name": "Purpose of Visit", "type": "text", "required": True},
            {"id": "b2_stay", "name": "Intended Length of Stay (Days/Months)", "type": "text", "required": True},
            {"id": "b2_funds", "name": "Available Travel Funds (USD)", "type": "number", "required": True},
            {"id": "b2_addr", "name": "US Contact / Hotel Address", "type": "text", "required": False}
        ]
    },
    {
        "country_code": "United States",
        "visa_type": "B-1 / B-2 Visitor Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "b2_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "b2_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "b2_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "b2_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "b2_email", "name": "Email", "type": "email", "required": True},
            {"id": "b2_phone", "name": "Phone Number", "type": "text", "required": False},
            {"id": "b2_purpose", "name": "Purpose of Visit", "type": "text", "required": True},
            {"id": "b2_stay", "name": "Intended Length of Stay (Days/Months)", "type": "text", "required": True},
            {"id": "b2_funds", "name": "Available Travel Funds (USD)", "type": "number", "required": True},
            {"id": "b2_addr", "name": "US Contact / Hotel Address", "type": "text", "required": False}
        ]
    },
    {
        "country_code": "United States",
        "visa_type": "O-1 Extraordinary Ability",
        "version": "1.0",
        "required_fields": [
            {"id": "us_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "us_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "us_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "us_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "us_email", "name": "Email", "type": "email", "required": True},
            {"id": "us_field", "name": "Field of Extraordinary Ability", "type": "text", "required": True},
            {"id": "us_awards", "name": "Major Awards or Distinctions", "type": "text", "required": False},
            {"id": "us_pubs", "name": "Scholarly Publications / Patents Count", "type": "number", "required": False},
            {"id": "us_pet", "name": "US Petitioner / Sponsor Entity Name", "type": "text", "required": True},
            {"id": "us_comp", "name": "Expected Annual Compensation ($)", "type": "number", "required": False}
        ]
    },
    {
        "country_code": "United States",
        "visa_type": "H-1B Specialty Occupation",
        "version": "1.0",
        "required_fields": [
            {"id": "h1_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "h1_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "h1_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "h1_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "h1_email", "name": "Email", "type": "email", "required": True},
            {"id": "h1_job", "name": "Job Title (Specialty Occupation)", "type": "text", "required": True},
            {"id": "h1_emp", "name": "US Employer Name", "type": "text", "required": True},
            {"id": "h1_deg", "name": "Bachelor / Master Degree Major", "type": "text", "required": True},
            {"id": "h1_wage", "name": "Offered Annual Wage ($)", "type": "number", "required": True}
        ]
    },
    {
        "country_code": "United States",
        "visa_type": "EB-2 NIW (National Interest Waiver)",
        "version": "1.0",
        "required_fields": [
            {"id": "eb_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "eb_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "eb_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "eb_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "eb_email", "name": "Email", "type": "email", "required": True},
            {"id": "eb_degree", "name": "Advanced Degree (Master's/PhD) Field", "type": "text", "required": True},
            {"id": "eb_endeavor", "name": "Proposed Endeavor of National Importance", "type": "text", "required": True},
            {"id": "eb_citations", "name": "Scholarly Citations / Commercial Impact Summary", "type": "text", "required": False}
        ]
    },
    {
        "country_code": "United States",
        "visa_type": "F-1 Student Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "f1_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "f1_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "f1_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "f1_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "f1_email", "name": "Email", "type": "email", "required": True},
            {"id": "f1_sevis", "name": "SEVIS ID Number (N-Number)", "type": "text", "required": True},
            {"id": "f1_school", "name": "US Institution Name (SEVP Certified)", "type": "text", "required": True},
            {"id": "f1_prog", "name": "Major / Field of Study", "type": "text", "required": True},
            {"id": "f1_funds", "name": "Total Available Financial Support (USD)", "type": "number", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # UNITED KINGDOM
    # -------------------------------------------------------------
    {
        "country_code": "United Kingdom",
        "visa_type": "Skilled Worker",
        "version": "1.0",
        "required_fields": [
            {"id": "uk_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "uk_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "uk_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "uk_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "uk_email", "name": "Email", "type": "email", "required": True},
            {"id": "uk_cos", "name": "Certificate of Sponsorship (CoS) Reference", "type": "text", "required": True},
            {"id": "uk_job", "name": "Job Title & SOC Code", "type": "text", "required": True},
            {"id": "uk_salary", "name": "Annual Salary (£)", "type": "number", "required": True},
            {"id": "uk_eng", "name": "English Level (SELT/Degree)", "type": "text", "required": True}
        ]
    },
    {
        "country_code": "United Kingdom",
        "visa_type": "Global Talent Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "ukg_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "ukg_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "ukg_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "ukg_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "ukg_email", "name": "Email", "type": "email", "required": True},
            {"id": "ukg_field", "name": "Field of Talent (Digital Tech/Academia/Arts)", "type": "text", "required": True},
            {"id": "ukg_body", "name": "Endorsing Body (Tech Nation/Royal Society/Arts Council)", "type": "text", "required": True},
            {"id": "ukg_awards", "name": "Key Achievements / Prestigious Awards", "type": "text", "required": False}
        ]
    },
    {
        "country_code": "United Kingdom",
        "visa_type": "Standard Visitor Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "ukv_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "ukv_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "ukv_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "ukv_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "ukv_email", "name": "Email", "type": "email", "required": True},
            {"id": "ukv_purpose", "name": "Main Reason for UK Visit", "type": "text", "required": True},
            {"id": "ukv_stay", "name": "Planned Duration in UK (Days/Weeks)", "type": "text", "required": True},
            {"id": "ukv_funds", "name": "Available Travel Funds (£)", "type": "number", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # AUSTRALIA
    # -------------------------------------------------------------
    {
        "country_code": "Australia",
        "visa_type": "Subclass 189 Skilled Independent",
        "version": "1.0",
        "required_fields": [
            {"id": "au_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "au_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "au_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "au_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "au_email", "name": "Email", "type": "email", "required": True},
            {"id": "au_occ", "name": "Nominated ANZSCO Occupation", "type": "text", "required": True},
            {"id": "au_assess", "name": "Skills Assessment Authority & Reference", "type": "text", "required": True},
            {"id": "au_pts", "name": "Estimated Points Score (65+ minimum)", "type": "number", "required": True},
            {"id": "au_eng", "name": "IELTS / PTE Academic Score", "type": "text", "required": True}
        ]
    },
    {
        "country_code": "Australia",
        "visa_type": "Subclass 482 Temporary Skill Shortage",
        "version": "1.0",
        "required_fields": [
            {"id": "au4_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "au4_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "au4_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "au4_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "au4_email", "name": "Email", "type": "email", "required": True},
            {"id": "au4_sponsor", "name": "Australian Approved Sponsor Name", "type": "text", "required": True},
            {"id": "au4_job", "name": "Nominated Position & ANZSCO Code", "type": "text", "required": True},
            {"id": "au4_salary", "name": "Guaranteed Annual Earnings (AUD)", "type": "number", "required": True},
            {"id": "au4_exp", "name": "Relevant Full-Time Work Experience (Years)", "type": "number", "required": True}
        ]
    },
    {
        "country_code": "Australia",
        "visa_type": "Subclass 600 Visitor Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "au6_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "au6_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "au6_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "au6_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "au6_email", "name": "Email", "type": "email", "required": True},
            {"id": "au6_purpose", "name": "Purpose of Visit (Tourist / Business Stream)", "type": "text", "required": True},
            {"id": "au6_stay", "name": "Length of Stay in Australia (Months)", "type": "number", "required": True},
            {"id": "au6_funds", "name": "Available Funds for Visit (AUD)", "type": "number", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # UNITED ARAB EMIRATES
    # -------------------------------------------------------------
    {
        "country_code": "United Arab Emirates",
        "visa_type": "Golden Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "uae_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "uae_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "uae_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "uae_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "uae_email", "name": "Email", "type": "email", "required": True},
            {"id": "uae_cat", "name": "Golden Visa Category (Professional/Talent/Investor)", "type": "text", "required": True},
            {"id": "uae_deg", "name": "Attested University Degree", "type": "text", "required": True},
            {"id": "uae_sal", "name": "Monthly Salary (AED, minimum 30,000)", "type": "number", "required": False}
        ]
    },
    {
        "country_code": "United Arab Emirates",
        "visa_type": "Remote Work Visa",
        "version": "1.0",
        "required_fields": [
            {"id": "uaer_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "uaer_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "uaer_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "uaer_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "uaer_email", "name": "Email", "type": "email", "required": True},
            {"id": "uaer_emp", "name": "Foreign Employer / Company Name", "type": "text", "required": True},
            {"id": "uaer_sal", "name": "Monthly Remote Salary (USD, min $3,500)", "type": "number", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # SINGAPORE
    # -------------------------------------------------------------
    {
        "country_code": "Singapore",
        "visa_type": "Employment Pass (EP)",
        "version": "1.0",
        "required_fields": [
            {"id": "sg_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "sg_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "sg_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "sg_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "sg_email", "name": "Email", "type": "email", "required": True},
            {"id": "sg_job", "name": "Job Title in Singapore", "type": "text", "required": True},
            {"id": "sg_emp", "name": "Singapore Hiring Entity (UEN)", "type": "text", "required": True},
            {"id": "sg_salary", "name": "Monthly Fixed Salary (SGD, min $5,600)", "type": "number", "required": True},
            {"id": "sg_deg", "name": "University Degree & Verification Proof", "type": "text", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # FRANCE
    # -------------------------------------------------------------
    {
        "country_code": "France",
        "visa_type": "Talent Passport",
        "version": "1.0",
        "required_fields": [
            {"id": "fr_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "fr_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "fr_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "fr_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "fr_email", "name": "Email", "type": "email", "required": True},
            {"id": "fr_job", "name": "French Employment Contract Position", "type": "text", "required": True},
            {"id": "fr_salary", "name": "Gross Annual Salary (€, min €41,933)", "type": "number", "required": True},
            {"id": "fr_deg", "name": "Master's Degree or Equivalent Qualification", "type": "text", "required": True}
        ]
    },
    # -------------------------------------------------------------
    # GENERIC FALLBACK
    # -------------------------------------------------------------
    {
        "country_code": "GENERIC",
        "visa_type": "GENERIC",
        "version": "1.0",
        "required_fields": [
            {"id": "gen_fn", "name": "First Name", "type": "text", "required": True},
            {"id": "gen_ln", "name": "Last Name", "type": "text", "required": True},
            {"id": "gen_dob", "name": "Date of Birth", "type": "date", "required": True},
            {"id": "gen_pass", "name": "Passport Number", "type": "text", "required": True},
            {"id": "gen_email", "name": "Email", "type": "email", "required": True},
            {"id": "gen_phone", "name": "Phone Number", "type": "text", "required": False},
            {"id": "gen_occ", "name": "Current Occupation / Job Title", "type": "text", "required": True},
            {"id": "gen_exp", "name": "Years of Experience", "type": "number", "required": False},
            {"id": "gen_edu", "name": "Highest Level of Education", "type": "text", "required": False}
        ]
    }
]

def standardize_field_names(fields: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Standardizes field names within a schema so common fields (First Name, Last Name, etc.)
    always use clean human-readable names instead of cryptic IDs like US_FN.
    """
    cleaned = []
    for f in fields:
        f_copy = dict(f)
        raw_name = str(f_copy.get("name", "")).strip()
        raw_id = str(f_copy.get("id", "")).strip().lower()
        
        # Check if name is a known abbreviation or ID
        norm_name_key = raw_name.lower().replace(" ", "_").replace("-", "_")
        if norm_name_key in STANDARD_FIELD_NAME_MAP:
            f_copy["name"] = STANDARD_FIELD_NAME_MAP[norm_name_key]
        elif raw_id in STANDARD_FIELD_NAME_MAP and (raw_name.upper() == raw_name or len(raw_name) <= 6):
            f_copy["name"] = STANDARD_FIELD_NAME_MAP[raw_id]
            
        cleaned.append(f_copy)
    return cleaned

def seed_default_schemas(db) -> int:
    """
    Populates and standardizes default immigration form schemas in the database.
    Also cleans up existing schemas that might have had abbreviated field names like US_FN.
    Returns the number of seeded/updated schemas.
    """
    import models
    from sqlalchemy.orm.attributes import flag_modified
    count = 0

    # 1. Seed or update all standard seed schemas
    for schema_data in SEED_SCHEMAS:
        c_code = schema_data["country_code"]
        v_type = schema_data["visa_type"]
        existing = db.query(models.CountrySchema).filter(
            models.CountrySchema.country_code.ilike(c_code),
            models.CountrySchema.visa_type.ilike(v_type)
        ).first()
        std_fields = standardize_field_names(schema_data.get("required_fields", []))
        
        if not existing:
            new_schema = models.CountrySchema(
                country_code=c_code,
                visa_type=v_type,
                version=schema_data.get("version", "1.0"),
                required_fields=std_fields
            )
            db.add(new_schema)
            count += 1
        else:
            # Standardize and refresh existing schema fields
            existing.required_fields = std_fields
            flag_modified(existing, "required_fields")
            count += 1

    # 2. Cleanup & standardize any other dynamically created schemas in DB
    all_schemas = db.query(models.CountrySchema).all()
    for s in all_schemas:
        if s.required_fields and isinstance(s.required_fields, list):
            cleaned = standardize_field_names(s.required_fields)
            if cleaned != s.required_fields:
                s.required_fields = cleaned
                flag_modified(s, "required_fields")
                count += 1

    # 3. Cleanup existing cases to ensure extracted_data keys match standardized field names
    try:
        cases = db.query(models.UserCaseState).all()
        for c in cases:
            if c.extracted_data and isinstance(c.extracted_data, dict):
                normalized_data = {}
                modified = False
                for k, v in c.extracted_data.items():
                    k_norm = k.lower().replace(" ", "_").replace("-", "_")
                    std_k = STANDARD_FIELD_NAME_MAP.get(k_norm, k)
                    normalized_data[std_k] = v
                    if std_k != k:
                        modified = True
                if modified:
                    c.extracted_data = normalized_data
                    flag_modified(c, "extracted_data")
                    count += 1
    except Exception as case_err:
        print(f"Case normalization note: {case_err}")

    if count > 0:
        db.commit()
    return count
