---
name: Kinetic Executive
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daf4'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d9e2fc'
  on-surface: '#121b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#273044'
  inverse-on-surface: '#edf0ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#4b4bd2'
  primary: '#4141c8'
  on-primary: '#ffffff'
  primary-container: '#5b5ce2'
  on-primary-container: '#f2efff'
  inverse-primary: '#c1c1ff'
  secondary: '#5c4bc3'
  on-secondary: '#ffffff'
  secondary-container: '#9485ff'
  on-secondary-container: '#2a0992'
  tertiary: '#525561'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a6d7a'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#08006b'
  on-primary-fixed-variant: '#322fba'
  secondary-fixed: '#e5deff'
  secondary-fixed-dim: '#c7bfff'
  on-secondary-fixed: '#180065'
  on-secondary-fixed-variant: '#4330aa'
  tertiary-fixed: '#e0e2f0'
  tertiary-fixed-dim: '#c3c6d4'
  on-tertiary-fixed: '#181b26'
  on-tertiary-fixed-variant: '#434652'
  background: '#f9f9ff'
  on-background: '#121b2e'
  surface-variant: '#d9e2fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-precision, focused workspace for modern job seekers, executive career builders, and talent tracking. The aesthetic balances architectural restraint with vibrant, intelligent feedback mechanisms. 

- **Personality:** Decisive, intelligent, structured, and polished. It avoids whimsical consumer cliches, opting instead for crisp editorial density and enterprise-level reliability.
- **Design Movement:** Modern Architectural SaaS. Rooted in crisp structural frames, tonal depth, hairline borders, and subtle indigo-spectrum luminous highlights.
- **Tone & Mood:** Confident calm under high-stakes career transitions. The UI delivers absolute clarity, treating personal career assets (resumes, metrics, pipeline stages) as first-class, published documents rather than disposable web forms.

## Colors

The palette is engineered for prolonged operational focus, utilizing a cool slate bias across all neutrals to reduce luminance fatigue while preserving razor-sharp text legibility.

- **Canvas & Surfaces:**
  - Base App Canvas: `#F6F8FC` provides a cool, anti-glare foundation.
  - Primary Surface: `#FFFFFF` reserved for document sheets, floating panels, active data tables, and kanban cards.
  - Subdued / Inset Surface: `#F0F3F9` for table headers, inactive lanes, and docked sidebars.
- **Text & Hierarchy:**
  - High Emphasis (Primary): `#172033` (deep slate navy, ensuring crisp legibility).
  - Medium Emphasis (Secondary): `#69758A` (neutralized slate for meta-labels, timestamps, and hints).
  - Low Emphasis (Disabled / Watermark): `#9DA7B8`.
- **Accents & States:**
  - Primary Action: `#5B5CE2` (electric periwinkle-indigo).
  - Primary Action Hover: `#494ACB`.
  - Secondary Accent: `#8B7CF6` (soft iris, deployed for AI prompts, auto-generation markers, and smart suggestions).
  - Tinted Accent Fill: `#EEF0FF` for pill highlights, subtle row selections, and active kanban drop zones.
  - Structural Border: `#E5E9F2` providing high-definition hairline separation without heavy visual load.
- **Semantic Feedback:**
  - Success: `#168568` (rich jade green for completed stages, accepted offers, and positive ATS matches).
  - Warning: `#B7791F` (amber ochre for expiring deadlines and missing resume keywords).
  - Error: `#D94B58` (crimson rose for critical validation, rejected submissions, or parse failures).
  - Info: `#3478D4` (clean cobalt for tracking telemetry, pipeline guidance, and notes).

## Typography

The typography uses a single versatile grotesque sans-serif family (`Inter`), leveraging subtle tracking variations and explicit weight pairings to establish immediate information hierarchy.

- **Numerical & Data Rendering:** Numeric values inside metric dashboards and kanban stage tallies utilize tabular figures (`font-variant-numeric: tabular-nums`) to guarantee horizontal stability.
- **Editorial Document View (Resume Preview):** The live preview uses balanced line lengths (60–75 characters) with tightened headline tracking to simulate print and PDF typography.
- **Micro-Labels:** `label-sm` is reserved for ATS match scores, pipeline badges, and uppercase category headers. Ensure uppercase tracking is consistently kept between `0.04em` and `0.06em`.

## Layout & Spacing

A strictly enforced 8-point baseline grid drives all spacing values, margins, and component alignments.

- **Split View Resume Workspace:** 
  - Dual-pane layout on desktop: Left editor pane consumes 45% (min 480px, max 640px) with fluid vertical scrolling; right sheet preview pane occupies the remaining space, centered with fixed margins.
  - On screens narrower than 1024px, the workspace stacks or toggles via an anchored segmented controller (`Edit` | `Preview`).
- **Kanban Board:** Horizontal scroll pipeline utilizing 300px fixed-width columns with a persistent 16px gutter.
- **Data Tables:** Dense horizontal grid with 12px vertical cell padding and 16px horizontal edge padding to support comprehensive job application logs without visual clutter.

## Elevation & Depth

Visual hierarchy uses flat physical stacking with low-contrast structural borders and ultra-diffused, ambient drop shadows. Crisp `#E5E9F2` hairline borders (1px) define edges, while shadows solely indicate active elevation and hover physics.

- **Level 0 (Flat Canvas):** No shadow. `#F6F8FC` baseline with nested `#FFFFFF` cards bordered by `1px solid #E5E9F2`.
- **Level 1 (Resting Cards & Table Rows):** `0 1px 3px 0 rgba(23, 32, 51, 0.04), 0 1px 2px -1px rgba(23, 32, 51, 0.02)`.
- **Level 2 (Hover States, Dragging Kanban Cards, Menus):** `0 8px 16px -4px rgba(23, 32, 51, 0.06), 0 2px 6px -1px rgba(23, 32, 51, 0.04)`.
- **Level 3 (Modals, ATS Analytics Drawers):** `0 20px 25px -5px rgba(23, 32, 51, 0.08), 0 8px 10px -6px rgba(23, 32, 51, 0.04)`.
- **Backdrop Overlay:** `rgba(23, 32, 51, 0.4)` with an active `4px` blur filter for modal overlays.

## Shapes

The geometric architecture pairs spacious, gently curved structural containers with taut, tactile interactive controls.

- **Containers & Major Cards:** Configured with a dedicated `16px` radius (`rounded-lg`) to soften the large surface areas of resume previews, kanban lane bodies, and analytics blocks.
- **Controls & Form Elements:** Standardized at `10px` radius for input fields, buttons, dropdown selects, and search bars.
- **Tags, Pills, & Badges:** Full circular rounding (`9999px`) for status chips (e.g., "Interviewing", "Offer", "Archived") and ATS match percentage markers.
- **Borders:** All structural boundaries use a uniform `1px` stroke without rounded inner seam bleed.

## Components

### Buttons
- **Primary:** Background `#5B5CE2`, text `#FFFFFF`, radius `10px`, padding `10px 18px`. Hover: `#494ACB`. Active: micro-scale `0.98`. Focus: `0 0 0 3px #EEF0FF`.
- **Secondary / Outline:** Background `#FFFFFF`, border `1px solid #E5E9F2`, text `#172033`. Hover: `#F6F8FC` and border `#D0D7E3`.
- **Ghost:** Background transparent, text `#69758A`. Hover: background `#EEF0FF`, text `#5B5CE2`.
- **AI Assist Action Button:** Gradient border or surface tint `#EEF0FF`, text `#5B5CE2`, icon `Sparkles` in `#8B7CF6`.

### Input Fields & Controls
- **Text Field:** Height `40px`, background `#FFFFFF`, border `1px solid #E5E9F2`, radius `10px`, typography `body-md`. Focus: border `#5B5CE2`, shadow `0 0 0 3px #EEF0FF`.
- **Checkboxes & Radios:** `18px × 18px`, radius `4px` (checkbox) / `50%` (radio). Inactive: border `1.5px solid #E5E9F2`. Checked: background `#5B5CE2` with crisp `#FFFFFF` checkmark.

### Chips & Status Badges
- **Pill Badge:** Height `24px`, padding `0 10px`, radius `9999px`, font `label-sm`.
  - Applied/Active: Background `#EEF0FF`, text `#5B5CE2`.
  - Interviewing: Background `rgba(52, 120, 212, 0.1)`, text `#3478D4`.
  - Offer: Background `rgba(22, 133, 104, 0.1)`, text `#168568`.
  - Rejection: Background `rgba(217, 75, 88, 0.1)`, text `#D94B58`.

### Cards & Kanban Pipeline
- **Kanban Card:** Radius `16px`, background `#FFFFFF`, border `1px solid #E5E9F2`, padding `16px`. Elevation Level 1. Top bar indicator reflecting opportunity urgency. Hover transitions to Elevation Level 2.
- **Stage Column:** Background `#F0F3F9`, border `1px solid #E5E9F2`, radius `16px`, padding `12px`. Header features column counter with pill style.

### Resume Document Pane
- Centered digital artboard formatted to true aspect ratio (A4/Letter), `#FFFFFF` surface, bordered by subtle `#E5E9F2` border, elevated with Level 2 ambient shadow.
- Drag-and-drop section blocks expose an indigo hairline insertion guide (`2px solid #5B5CE2`) during layout restructuring.
- Inline text fields within the editor feature seamless ghost inputs that display a border only on hover or active cursor focus.

### Data Tables
- Header row uses `#F0F3F9` background, `label-md` uppercase text in `#69758A`, `1px solid #E5E9F2` bottom boundary.
- Rows use `#FFFFFF` background, transitioning to `#F6F8FC` on row hover. Single select rows apply a soft `#EEF0FF` background.