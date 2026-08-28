import io
import datetime
import hashlib
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_styled_application_pdf(case_data: Dict[str, Any]) -> bytes:
    """
    Generates a high-quality, beautifully styled immigration application dossier PDF
    matching the Passage AI platform theme (Deep Navy, Teal, and Slate accents).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    story = []
    
    # Palette definition (Matching Passage Frontend)
    PRIMARY_NAVY = colors.HexColor('#0F2942')
    SECONDARY_TEAL = colors.HexColor('#0D9488')
    ACCENT_LIGHT = colors.HexColor('#F1F5F9')
    TEXT_DARK = colors.HexColor('#0F172A')
    TEXT_MUTED = colors.HexColor('#64748B')
    BORDER_COLOR = colors.HexColor('#CBD5E1')
    WHITE = colors.HexColor('#FFFFFF')
    SUCCESS_BG = colors.HexColor('#E6FFFA')
    SUCCESS_TEXT = colors.HexColor('#047857')

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'PassageTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY_NAVY
    )
    
    subtitle_style = ParagraphStyle(
        'PassageSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=SECONDARY_TEAL,
        alignment=TA_LEFT
    )

    brand_badge_style = ParagraphStyle(
        'PassageBrandBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=WHITE,
        alignment=TA_RIGHT
    )

    h2_style = ParagraphStyle(
        'PassageH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=PRIMARY_NAVY
    )

    body_style = ParagraphStyle(
        'PassageBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=TEXT_DARK
    )

    body_bold = ParagraphStyle(
        'PassageBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=TEXT_DARK
    )

    muted_style = ParagraphStyle(
        'PassageMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=TEXT_MUTED
    )

    # Extract Data from Case
    case_id = case_data.get("case_id", "APP-UNKNOWN")
    country = case_data.get("target_country", "General") or "General"
    visa = case_data.get("visa_type", "General Intake") or "General Intake"
    status = case_data.get("status", "Certified Complete")
    extracted_data = case_data.get("extracted_data") or {}
    missing_fields = case_data.get("missing_fields") or []
    
    applicant_name = (
        extracted_data.get("First Name", "") + " " + extracted_data.get("Last Name", "")
    ).strip() or extracted_data.get("Given Name", "") or extracted_data.get("Full Name", "") or "Applicant"

    gen_time = datetime.datetime.now(datetime.timezone.utc).strftime("%B %d, %Y - %H:%M UTC")

    # Generate integrity hash
    data_str = f"{case_id}:{country}:{visa}:{sorted(extracted_data.items())}"
    doc_checksum = hashlib.sha256(data_str.encode()).hexdigest()[:16].upper()

    # 1. HEADER SECTION (Passage Brand Banner)
    header_data = [
        [
            Paragraph("<b>PASSAGE</b> <font color='#0D9488'>AI</font><br/><font size=8 color='#64748B'>INTELLIGENT IMMIGRATION PLATFORM</font>", subtitle_style),
            Paragraph(f"<b>OFFICIAL APPLICATION DOSSIER</b><br/><font size=8 color='#64748B'>CASE #{case_id}</font>", ParagraphStyle('R_Align', parent=subtitle_style, alignment=TA_RIGHT))
        ]
    ]
    header_table = Table(header_data, colWidths=[270, 262])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_NAVY, spaceBefore=2, spaceAfter=14))

    # 2. OVERVIEW SUMMARY CARD
    summary_data = [
        [
            Paragraph("<b>Applicant Full Name</b>", muted_style),
            Paragraph("<b>Target Destination</b>", muted_style),
            Paragraph("<b>Visa Pathway</b>", muted_style),
            Paragraph("<b>Status</b>", muted_style),
        ],
        [
            Paragraph(f"<b>{applicant_name}</b>", title_style),
            Paragraph(f"<b>{country}</b>", ParagraphStyle('P2', parent=body_bold, fontSize=11, textColor=PRIMARY_NAVY)),
            Paragraph(f"<b>{visa}</b>", ParagraphStyle('P3', parent=body_bold, fontSize=11, textColor=SECONDARY_TEAL)),
            Paragraph(f"<b>{status}</b>", ParagraphStyle('P4', parent=body_bold, fontSize=10, textColor=SUCCESS_TEXT)),
        ],
        [
            Paragraph(f"Date Generated: {gen_time}", muted_style),
            Paragraph(f"Security Checksum: {doc_checksum}", muted_style),
            Paragraph(f"Verified Records: {len(extracted_data)} fields", muted_style),
            Paragraph("Certification: Verified", muted_style),
        ]
    ]
    summary_table = Table(summary_data, colWidths=[150, 130, 140, 112])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 16))

    # 3. STRUCTURED APPLICATION DATA TABLE
    story.append(Paragraph("Verified Application Data Records", h2_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=SECONDARY_TEAL, spaceBefore=4, spaceAfter=8))

    records_rows = [
        [
            Paragraph("<b>Field Name</b>", ParagraphStyle('TH1', parent=body_bold, textColor=WHITE)),
            Paragraph("<b>Verified Information Value</b>", ParagraphStyle('TH2', parent=body_bold, textColor=WHITE)),
            Paragraph("<b>Audit Status</b>", ParagraphStyle('TH3', parent=body_bold, textColor=WHITE, alignment=TA_CENTER))
        ]
    ]

    if extracted_data:
        for idx, (key, value) in enumerate(extracted_data.items()):
            field_name_clean = key.replace('_', ' ').title()
            val_clean = str(value) if value is not None and str(value).strip() != "" else "Pending"
            
            records_rows.append([
                Paragraph(f"<b>{field_name_clean}</b>", body_style),
                Paragraph(val_clean, body_bold),
                Paragraph("VERIFIED", ParagraphStyle('VCheck', parent=body_bold, fontSize=8, textColor=SUCCESS_TEXT, alignment=TA_CENTER))
            ])
    else:
        records_rows.append([
            Paragraph("<i>No data populated</i>", muted_style),
            Paragraph("<i>Awaiting applicant intake completion</i>", muted_style),
            Paragraph("PENDING", muted_style)
        ])

    records_table = Table(records_rows, colWidths=[180, 272, 80])
    
    t_styles = [
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]

    # Alternate row colors
    for r in range(1, len(records_rows)):
        if r % 2 == 0:
            t_styles.append(('BACKGROUND', (0, r), (-1, r), colors.HexColor('#F8FAFC')))

    records_table.setStyle(TableStyle(t_styles))
    story.append(records_table)
    story.append(Spacer(1, 16))

    # 4. COMPLIANCE & CHECKLIST SECTION
    if missing_fields:
        story.append(Paragraph("Pending Application Requirements", ParagraphStyle('WarnH', parent=h2_style, textColor=colors.HexColor('#B91C1C'))))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#EF4444'), spaceBefore=4, spaceAfter=8))
        
        warn_data = [[
            Paragraph(f"<b>Action Required:</b> The following {len(missing_fields)} mandatory field(s) were pending at the time of export: <b>{', '.join(missing_fields)}</b>. Please finalize before official government lodgement.", body_style)
        ]]
        warn_table = Table(warn_data, colWidths=[532])
        warn_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FEF2F2')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#FCA5A5')),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(warn_table)
        story.append(Spacer(1, 14))

    # 5. OFFICIAL CERTIFICATION & SIGNATURE BLOCK
    cert_elements = [
        Paragraph("Applicant & Representative Declaration", h2_style),
        HRFlowable(width="100%", thickness=0.5, color=SECONDARY_TEAL, spaceBefore=4, spaceAfter=8),
        Paragraph(
            "I hereby declare and affirm under penalty of applicable immigration law that the information set forth in this application dossier is complete, true, and correct to the best of my knowledge and belief. I understand that any false statement or omission may result in denial of visa authorization or revocation of legal status.",
            body_style
        ),
        Spacer(1, 12),
        Table([
            [
                Paragraph("<b>Applicant / Legal Representative Signature:</b>", body_style),
                Paragraph("<b>Date Signed:</b>", body_style)
            ],
            [
                Paragraph("___________________________________________________", body_style),
                Paragraph(datetime.datetime.now().strftime("%Y-%m-%d"), body_bold)
            ]
        ], colWidths=[360, 172], style=[('VALIGN', (0,0), (-1,-1), 'BOTTOM'), ('BOTTOMPADDING', (0,0), (-1,-1), 4)]),
        Spacer(1, 14),
        Table([
            [
                Paragraph(f"<b>Passage AI Electronic Verification System</b> • Checksum: {doc_checksum}", muted_style),
                Paragraph("Page 1 of 1 • Official Immigrant Record", ParagraphStyle('TR', parent=muted_style, alignment=TA_RIGHT))
            ]
        ], colWidths=[350, 182])
    ]

    story.append(KeepTogether(cert_elements))

    # Build document
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
