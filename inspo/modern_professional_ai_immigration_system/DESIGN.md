---
name: Modern Professional AI Immigration System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#43474e'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#13696a'
  on-secondary: '#ffffff'
  secondary-container: '#a2eded'
  on-secondary-container: '#1a6d6e'
  tertiary: '#2d1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#493100'
  on-tertiary-container: '#cb9524'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#a5eff0'
  secondary-fixed-dim: '#89d3d4'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#f8bc4b'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.25'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  max-width: 1200px
---

## Brand & Style

This design system is engineered for an AI-powered immigration platform where the stakes are high and user confidence is paramount. The visual identity follows a **Corporate / Modern** aesthetic, prioritizing functional clarity and systematic reliability over decorative elements. 

The brand personality is authoritative yet accessible—acting as a digital counselor that guides users through complex legal landscapes. By utilizing a "Safe" visual identity, the system leverages industry-standard patterns to reduce cognitive load, ensuring that users feel secure while providing sensitive personal data. The interface utilizes generous whitespace and a structured grid to convey a sense of order and precision.

## Colors

The palette is anchored in **Trustworthy Deep Blue (#1A365D)**, a color synonymous with institutional stability and legal authority. This is complemented by **Accent Teal (#2C7A7B)**, which is reserved specifically for AI-driven insights, success states, and progress indicators, creating a clear mental model for where technology is assisting the user.

- **Primary:** Navigation, primary actions, and brand touchpoints.
- **Secondary:** AI interactions, chat interfaces, and positive status updates.
- **Background:** A very light gray (#F7FAFC) to reduce eye strain and differentiate from white card surfaces.
- **Neutral:** A range of slate grays (from #2D3748 for headings to #E2E8F0 for borders) ensures high legibility and soft structural containment.
- **Alerts:** Functional colors are used sparingly; Amber for "Needs Review" and Red for "Critical Error," ensuring the user’s attention is directed only where necessary.

## Typography

The system utilizes **Inter** across all roles to maximize legibility and maintain a neutral, systematic tone. Inter’s tall x-height and clear letterforms are ideal for data-heavy forms and legal text.

Scale is used to establish a strict hierarchy. Headlines are set with slightly tighter letter spacing and heavier weights to feel "grounded." Body text prioritizes a comfortable line height (1.5–1.6) to facilitate the reading of long-form immigration requirements. Labels are set in a smaller, semi-bold uppercase style to distinguish them from user input and body copy.

## Layout & Spacing

The design system employs a **Fixed Grid** philosophy for desktop layouts to maintain a professional, organized structure, while transitioning to a fluid model for mobile devices. 

- **Grid:** A 12-column grid is used for dashboard layouts, with elements typically spanning 4, 6, or 8 columns to avoid overly wide line lengths in forms.
- **Rhythm:** An 8px base unit drives all spacing decisions. Consistent padding (24px) inside cards and containers creates a rhythm that feels intentional and stable.
- **Breakpoints:** 
  - **Mobile (<768px):** Single column, 16px side margins.
  - **Tablet (768px - 1024px):** 12-column fluid grid, 24px margins.
  - **Desktop (>1024px):** 12-column fixed (1200px max width), centered layout.

## Elevation & Depth

To maintain an "Enterprise-grade" feel, the system uses a **Tonal Layering** approach combined with subtle **Ambient Shadows**. This avoids the "flatness" that can sometimes feel unpolished, while steering clear of overly dramatic shadows that detract from the content.

- **Surface Levels:** The background is #F7FAFC. Secondary containers (like sidebar nav) are white. Primary content cards are also white but elevated via shadow.
- **Shadow Profile:** Shadows are diffused and low-opacity (10-15% alpha) using the Primary color (#1A365D) as a tint rather than pure black. This creates a more sophisticated, "cohesive" depth.
- **Interactions:** Buttons and cards use a subtle "lift" effect (increasing shadow spread) on hover to provide tactile feedback without breaking the professional tone.

## Shapes

The design system uses a **Rounded** shape language (8px / 0.5rem base radius). This specific level of roundedness is chosen to soften the "institutional" feel of immigration software, making it feel more modern and user-friendly while retaining enough structure to appear serious.

- **Buttons & Inputs:** 8px radius for a consistent, modern look.
- **Cards & Modals:** 16px (rounded-lg) for larger containers to create a distinct visual envelope.
- **Status Badges:** Fully pill-shaped (rounded-xl) to distinguish status indicators from clickable interactive elements.

## Components

### Buttons
- **Primary:** Solid #1A365D with white text. High emphasis.
- **AI Action:** Solid #2C7A7B with a subtle "sparkle" icon.
- **Secondary:** Outlined with #1A365D, 1px border.

### Status Badges
- Used for document states (e.g., "Pending," "Verified"). 
- Small, uppercase labels inside pill-shaped containers.
- Use low-saturation background tints (e.g., Light Teal background for "Verified" text).

### Document Trackers
- Horizontal or vertical steppers using #2C7A7B for completed stages.
- Unfinished stages use a light slate gray circle with a subtle 1px border.

### Input Fields
- White background with a 1px slate gray border (#E2E8F0).
- Focused state uses a 2px #1A365D border or a subtle outer glow.
- Labels are always visible above the field, never as placeholder text alone.

### AI Chat Interface
- AI messages are contained in subtle #F0F4F8 (light blue-gray) bubbles.
- User messages are contained in #1A365D bubbles.
- Clean, sans-serif typography with a focus on high-contrast readability.

### Cards
- White fill, 16px corner radius, and a subtle "Level 1" shadow.
- Used to group related form fields or display summary data.