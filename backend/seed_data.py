"""
Immigration Knowledge Base & Default Schema Seeder
Provides comprehensive domain knowledge about countries, visa categories, criteria,
and required form schemas for Canada, Germany, United States, United Kingdom, Australia, and UAE.
"""

from typing import Dict, List, Any

IMMIGRATION_KNOWLEDGE_BASE: Dict[str, Any] = {
    "Canada": {
        "description": "Leading destination for skilled workers, international students, and entrepreneurs with a points-based immigration system.",
        "visa_pathways": [
            {
                "name": "Express Entry (Federal Skilled Worker / CEC)",
                "description": "Points-based Comprehensive Ranking System (CRS) for skilled professionals.",
                "eligibility": "Minimum 1 year continuous full-time skilled work experience (NOC TEER 0, 1, 2, or 3), language proficiency (CLB 7+ in IELTS or CELPIP), Educational Credential Assessment (ECA) for foreign degrees, score 67+ on FSW six selection factors.",
                "key_documents": ["Passport", "ECA Report (WES/ICES)", "IELTS/CELPIP Results", "Employment Reference Letters", "Police Clearance Certificate", "Proof of Settlement Funds"]
            },
            {
                "name": "Study Permit & PGWP Pathway",
                "description": "For studying at a Canadian Designated Learning Institution (DLI) leading to up to 3 years Post-Graduation Work Permit (PGWP).",
                "eligibility": "Official Letter of Acceptance from DLI, proof of funds (CAD $20,635+ annual living expenses + tuition), clean background, intention to depart at permit expiration.",
                "key_documents": ["Letter of Acceptance (LOA)", "Proof of Financial Support / GIC", "Valid Passport", "Statement of Purpose (SOP)", "Language Scores"]
            },
            {
                "name": "Provincial Nominee Program (PNP)",
                "description": "For applicants with skills, education, or work experience targeted by specific provinces (e.g. Ontario OINP, BC PNP, Alberta AAIP).",
                "eligibility": "Meets specific provincial labor market criteria, provincial job offer or local education/in-demand occupation.",
                "key_documents": ["Provincial Nomination Certificate", "Job Offer Letter", "Skill & Credential Assessment", "Proof of Ties to Province"]
            }
        ]
    },
    "Germany": {
        "description": "Europe's economic engine offering points-based opportunity cards, EU Blue Cards, and fast-track skilled immigration.",
        "visa_pathways": [
            {
                "name": "Opportunity Card (Chancenkarte)",
                "description": "Points-based search-for-work card allowing 1 year stay in Germany to secure qualified employment (up to 20h/week part-time work permitted).",
                "eligibility": "State-recognized university degree or 2+ year vocational qualification + German A1 or English B2, scoring at least 6 points on age, qualifications, language, experience, and German connection.",
                "key_documents": ["Degree / Vocational Certificate (ZAB Anabin recognized)", "Language Certificate (Goethe/TestDaF/IELTS/TOEFL)", "Blocked Account (€12,324 minimum) or Employment Guarantee", "Detailed CV & Cover Letter"]
            },
            {
                "name": "EU Blue Card Germany",
                "description": "Premium work & residency permit for academics, engineers, IT specialists, and doctors with an expedited PR path (in as little as 21-27 months).",
                "eligibility": "Recognized higher education degree + binding German job contract meeting annual gross salary threshold (€45,300 standard or €41,041 for STEM / shortage occupations in 2024+).",
                "key_documents": ["German Employment Contract", "Declaration of Employment (Erklärung zum Beschäftigungsverhältnis)", "ZAB Degree Equivalence / Statement of Comparability", "Passport"]
            },
            {
                "name": "Skilled Worker Visa (Section 18a/18b AufenthG)",
                "description": "For qualified professionals with vocational training or degrees recognized in Germany.",
                "eligibility": "Concrete job offer in a qualified profession + official recognition notice (Anerkennungsbescheid) from competent German authority.",
                "key_documents": ["Definitive Recognition Notice", "Employment Contract", "Proof of German Language Proficiency", "Passport"]
            }
        ]
    },
    "United States": {
        "description": "Global hub for innovation, technology, science, business, and higher education.",
        "visa_pathways": [
            {
                "name": "O-1 Extraordinary Ability Visa",
                "description": "Non-immigrant visa for individuals with extraordinary ability in sciences, arts, education, business, or athletics.",
                "eligibility": "Demonstrated sustained national or international acclaim, meeting at least 3 of 8 regulatory criteria (major awards, publications, high salary, peer judging, critical leadership roles, significant original contributions, press coverage).",
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
                "description": "Direct Green Card immigrant petition self-petitionable without a job offer or PERM labor certification.",
                "eligibility": "Advanced degree (Master's/PhD) or exceptional ability + proposed endeavor has substantial merit and national importance, applicant is well positioned to advance it, and on balance it is beneficial to the US to waive job offer.",
                "key_documents": ["Form I-140", "Comprehensive Endeavor Statement", "Expert Testimonial Letters", "Scholarly Citations / Grants / Commercial Impact Evidence"]
            },
            {
                "name": "F-1 Student Visa & STEM OPT",
                "description": "For full-time academic studies with up to 3 years optional practical training (OPT) work authorization for STEM fields.",
                "eligibility": "Acceptance at SEVP-certified school, Form I-20, proof of financial ability to cover tuition & living expenses, non-immigrant intent.",
                "key_documents": ["Form I-20", "SEVIS Fee Receipt (I-901)", "DS-160 Confirmation", "Financial Statements"]
            }
        ]
    },
    "United Kingdom": {
        "description": "Points-based immigration system for skilled talent, global innovators, and international students.",
        "visa_pathways": [
            {
                "name": "Skilled Worker Visa",
                "description": "Work in an eligible job with an approved Home Office licensed sponsor employer.",
                "eligibility": "Valid Certificate of Sponsorship (CoS) from a licensed UK employer, eligible SOC occupation code, meeting general salary threshold (minimum £38,700 or going rate), English B1 (IELTS for UKVI).",
                "key_documents": ["Certificate of Sponsorship (CoS)", "Proof of English (SELT / Ecctis)", "Valid Passport", "Criminal Record Certificate", "Tuberculosis Test Results (if applicable)"]
            },
            {
                "name": "Global Talent Visa",
                "description": "Work in the UK for current or potential leaders in digital technology, academia, research, arts, and culture (no sponsor employer required).",
                "eligibility": "Endorsement by designated endorsement body (Tech Nation / Founders Forum, British Academy, Royal Society, Arts Council England) or holding an eligible prestigious prize.",
                "key_documents": ["Official Endorsement Letter", "CV and 3 Recommendation Letters from Industry Leaders", "Evidence of Significant Track Record & Innovation"]
            },
            {
                "name": "Student Visa & Graduate Route",
                "description": "Study at a licensed student sponsor university, with an automatic 2-year (3-year PhD) unsponsored post-study work visa.",
                "eligibility": "Confirmation of Acceptance for Studies (CAS), proof of financial maintenance funds (living costs £1,334/month London, £1,023/month outside), English proficiency B2.",
                "key_documents": ["CAS Statement", "Proof of Funds (28-day bank statement)", "ATAS Certificate (if required)", "Passport"]
            }
        ]
    },
    "Australia": {
        "description": "Points-tested General Skilled Migration and employer-sponsored programs with direct PR avenues.",
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
                "key_documents": ["Employer Nomination Approval", "Employment References & Pay Slips", "English Test Results"]
            },
            {
                "name": "Student Visa (Subclass 500) & Subclass 485 Temporary Graduate",
                "description": "Full-time study at a registered CRICOS provider followed by post-study work rights.",
                "eligibility": "Confirmation of Enrolment (CoE), Genuine Student (GS) requirement, proof of funds, Overseas Student Health Cover (OSHC).",
                "key_documents": ["Confirmation of Enrolment (CoE)", "Genuine Student Statement", "Financial Proof", "OSHC Policy"]
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
            }
        ]
    }
}

SEED_SCHEMAS = [
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

def seed_default_schemas(db) -> int:
    """
    Populates default immigration form schemas in the database if they don't already exist.
    Returns the number of seeded/updated schemas.
    """
    import models
    count = 0
    for schema_data in SEED_SCHEMAS:
        c_code = schema_data["country_code"]
        v_type = schema_data["visa_type"]
        existing = db.query(models.CountrySchema).filter_by(country_code=c_code, visa_type=v_type).first()
        if not existing:
            new_schema = models.CountrySchema(
                country_code=c_code,
                visa_type=v_type,
                version=schema_data.get("version", "1.0"),
                required_fields=schema_data.get("required_fields", [])
            )
            db.add(new_schema)
            count += 1
        else:
            # Update fields if empty
            if not existing.required_fields:
                existing.required_fields = schema_data.get("required_fields", [])
                count += 1
    if count > 0:
        db.commit()
    return count
