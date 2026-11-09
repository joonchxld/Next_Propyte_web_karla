---
name: Propyte Landings
description: Monograph of real inventory in the official Propyte brand (aqua on Aztec), family system for the /lp/* landings.
colors:
  aqua: "#a2f9ff"
  onahau: "#ccffff"
  water-dew: "#ebfdff"
  retro-cyan: "#68a4a9"
  dull-teal: "#487379"
  dark-slate: "#2e4f52"
  deep-onyx: "#223232"
  aztec: "#0a1c1e"
  tech-white: "#f5f5f5"
  node-grid: "#d8ece9"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.2rem + 5.2vw, 6rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.9vw, 1.875rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Space Grotesk, ui-sans-serif, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0"
  subtitle:
    fontFamily: "Space Grotesk, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
rounded:
  sm: "14px"
  md: "22px"
  lg: "28px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.aztec}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.dark-slate}"
  button-chosen:
    backgroundColor: "{colors.aqua}"
    textColor: "{colors.aztec}"
    rounded: "{rounded.pill}"
    height: "56px"
  button-chosen-hover:
    backgroundColor: "{colors.onahau}"
  button-submit:
    backgroundColor: "{colors.aqua}"
    textColor: "{colors.aztec}"
    rounded: "{rounded.pill}"
  button-submit-hover:
    backgroundColor: "#ffffff"
  colofon-option:
    backgroundColor: "{colors.aztec}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "48px"
  colofon-option-pressed:
    backgroundColor: "{colors.aqua}"
    textColor: "{colors.aztec}"
  index-option:
    backgroundColor: "#ffffff"
    textColor: "{colors.dark-slate}"
    rounded: "{rounded.pill}"
    height: "44px"
  index-option-pressed:
    backgroundColor: "{colors.aztec}"
    textColor: "{colors.aqua}"
  chip:
    backgroundColor: "{colors.onahau}"
    textColor: "{colors.dark-slate}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  plate:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "16px"
  data-table:
    backgroundColor: "{colors.water-dew}"
    rounded: "{rounded.sm}"
  request-sheet:
    backgroundColor: "{colors.aztec}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
---

# Design System: Propyte Landings

## Overview

**Creative North Star: "The Monograph"**

A monograph about real inventory. The page opens on one real house full-bleed with its entry price in the headline; a black colofon strip states how many houses exist and where; each house is then a white plate with a large photo beside a data column, alternating sides. Palette, glass panels, the grid of lines and nodes, and pills come from the official Propyte brand manual ("PROPYTE PRESENTACIÓN OFICIAL", 2026). This supersedes the first build's white-paper and blueprint-blue direction; the build in `monografia.css` is the record.

Density is calm and legible. Display type is large and tight, text is quiet, details and figures are small and precise. New Aqua is rare and lives on Aztec; light areas are Tech White and Water Dew. This is the family base for all nine /lp/* landings (pilot: casas-riviera-maya). Each landing may vary its idea around its own photo and figure, but not these tokens or the invariants below.

**Key Characteristics:**
- Aztec dark with New Aqua accent over a Tech White ground
- Full-bleed photo cover under an Aztec veil, with the node grid fading in from the right edge
- Colofon strip of live counts that doubles as the city filter
- White plates, 8/4 for the first house then 7/5 alternating
- Glass request sheet inside the first viewport, mobile included
- Every pressable is a pill; labels are sentence case; zero exit links

## Colors

A cool aqua-and-teal brand palette with one near-black. Warm colors appear nowhere. Source: the brand manual (New Aqua is Pantone 635C).

### Primary
- **New Aqua** (#a2f9ff): accent for figures in the headline, selected states, and the submit CTA, always over Aztec, the veil, or the gradient.

### Secondary
- **Onahau** (#ccffff): status chip fill, colofon data text, hover for the chosen button.
- **Retro Cyan** (#68a4a9): lightest stop of the closing gradient only.
- **Dull Teal** (#487379): secondary text, "Confirmar" notes, icon strokes, focus ring on light surfaces, hairlines at 14-25%.

### Neutral
- **Aztec** (#0a1c1e): brand dark; text on light, cover, colofon, footer, form glass, primary button.
- **Deep Onyx** (#223232): middle stop of the closing gradient.
- **Dark Slate** (#2e4f52): secondary body text, button hover, index chip text.
- **Water Dew** (#ebfdff): light glass for the data table and the notes section.
- **Tech White** (#f5f5f5): page ground of the plates section.
- **Node grid** (#d8ece9 at 25% line, 55% node): the manual's grid of lines and nodes, 160px cell, 2.5px nodes.

### Named Rules
**The Aqua On Dark Rule.** New Aqua carries meaning only on Aztec, the veil or the gradient. It never sets text on a light surface.

**The Brand Gradient Rule.** The one gradient is Aztec, Deep Onyx, Dull Teal, Retro Cyan at 170deg, on the closing section. The cover uses an Aztec veil (100deg, 88% to 5%), not a second gradient.

**The Sub-brand Rule.** Aureoline Yellow #F9A620 (Propyte MX) and Bright Pastel Green #A8F58B (Propyte Market, B2C) are manual colors for other lines and are not used on these landings.

## Typography

**Display Font:** Inter (site-wide substitute for Neue Haas Grotesk Display Pro, paid)
**Body Font:** DM Sans (substitute for Normalidad VF, paid)
**Label/Mono Font:** Space Grotesk (the manual's detail face)

**Character:** Large neutral grotesque headlines at 500 with tight tracking, quiet humanist text, and a technical detail face for figures and captions.

### Hierarchy
- **Display** (500, clamp 2.6rem to 6rem, 1.0, -0.035em): cover headline and prices (prices at clamp 2rem to 3rem). The headline's second line, the "desde" figure, is aqua at 600.
- **Headline** (500, clamp 1.75rem to 2.75rem and up to 4.5rem on the close, 1.0): section titles, the live count heading.
- **Title** (500, clamp 1.375rem to 1.875rem, 1.15, -0.02em): house titles in plates.
- **Body** (400, 0.9375rem, 1.625): descriptions; cover subtitle scales to 1.125rem at sm; max about 48-54ch.
- **Subtitle** (Space Grotesk 600, 1rem, 1.35): headings in the notes and closing lists.
- **Label** (Space Grotesk 500, 0.875rem, no tracking, sentence case): form labels, captions, gallery footers, filter chips (0.9375rem).

### Named Rules
**The Sentence Case Rule.** No uppercase tracked labels or eyebrows anywhere. Where the shared form or layout ships them, the sheet neutralises them (`text-transform: none; letter-spacing: 0`).

**The Tabular Figure Rule.** Counts, prices and ranges use tabular lining numerals.

**The Live Figure Rule.** Every figure printed comes from the live inventory. A missing value reads "Confirmar" in Dull Teal at 0.8em, never a guess.

## Layout

A 92rem max container with 20px side padding, 32px from 640px. The plates section is a single column of plates; from 1024px each plate is a 12-column grid (photo 8 and data 4 for the first, then 7 and 5 alternating sides). Gaps are 24px, 32px at lg. Section rhythm is generous (64-112px vertical).

The cover is the first viewport: photo height max(54svh, 27rem) on mobile, 88svh min from 1024px. On desktop the request sheet (27rem wide) floats over the photo and colofon at the right edge; on mobile it follows the colofon directly. Measured: the Nombre field sits at about 760px on a 390x844 viewport, inside the first view. The closing section pairs headline and list with the sticky form (28rem column).

Breakpoints in use: 640px and 1024px.

## Elevation & Depth

Hybrid of flat tonal layers and glass. Plates are white on Tech White with a soft ambient shadow; the request sheet is Aztec glass over the photo; the data table is Water Dew glass. No hard or offset shadows.

### Shadow Vocabulary
- **Plate** (`0 1px 2px rgb(10 28 30 / 0.05), 0 18px 40px -28px rgb(10 28 30 / 0.35)`): resting plate.
- **Sheet** (`0 30px 70px -30px rgb(0 0 0 / 0.6)` with `backdrop-filter: blur(18px) saturate(1.2)`): request sheet over photo.

### Named Rules
**The Glass Is For Data Rule.** Blur glass is reserved for the request sheet and the data table. Plates and buttons do not blur.

Motion: the cover photo settles from 1.045 to 1 over 1600ms (ease-out expo); plates rise 28px as they enter the viewport (scroll timeline); chips and buttons change over 200ms ease. All of it only under `prefers-reduced-motion: no-preference`.

## Shapes

Rounded, soft, and consistent. 14px for nested data panels and fields, 22px for the sheet and gallery images, 28px for plates, 999px for everything pressable and for chips and icon discs. Hairline borders are 1px at 12-28% of Aztec, Dull Teal or aqua.

### Named Rules
**The Pill Rule.** Anything the visitor can press is a 999px pill; content-holding surfaces are 14, 22 or 28px.

## Components

### Buttons
- **Shape:** full pill (999px), 56px tall, 24px side padding, 500 weight.
- **Primary:** Aztec fill, white text; hover Dark Slate. In plates it is full-width with a trailing arrow.
- **Chosen:** New Aqua fill, Aztec text; hover Onahau. Shows after "choose this house".
- **Submit (in the sheet):** New Aqua pill, Aztec text, 600, no uppercase; hover white.
- **Focus:** 2px Dull Teal outline, 3px offset (aqua on dark).

### Chips
- **Status chip:** Onahau fill, Dark Slate text, Space Grotesk 500 at 0.8125rem, with a small icon.
- **Colofon option:** Aztec strip, aqua hairline 24%, count in Inter 600 at 1.5rem plus label; pressed becomes aqua with Aztec text; 48px tall; scrolls horizontally on mobile.
- **Index option:** white with a 16% Aztec hairline, 44px; pressed inverts to Aztec with aqua text.

### Cards / Containers
- **Plate:** white, 28px radius, 12px padding (16px at lg), plate shadow. Photo gallery with 22px image corners and a caption "n de total · zone, city".
- **Data table:** Water Dew glass, 14px radius, 2-column grid; each cell is a 44px white disc holding an icon, a value in 600 and a label in Dull Teal. Only values that exist are printed.

### Inputs / Fields
The form is the shared `FormCasas`, re-tinted by variables on `.lpm-hoja`: white text on Aztec at 80% with blur, aqua hairline inputs, labels in sentence-case Space Grotesk, error color #ffb4a8 on dark. Do not fork the component.

### Navigation
No navigation menu and no exit links; only legal links in the footer. The colofon chips and index chips filter by city (same event, kept in sync). A mobile bottom bar offers the request/WhatsApp action.

### Colofon (signature)
The black strip under the cover: live count per city as filter chips, then the price range, minimum down payment and delivery status, joined by middots in Onahau.

## Do's and Don'ts

### Do:
- **Do** keep every figure (price, down payment, counts, ranges) derived from live inventory; where the developer did not declare a value print the muted "Confirmar" note in Dull Teal.
- **Do** keep zero exit links except legal ones; "choose this house" scrolls to the form and preselects the house.
- **Do** keep the request form visible in the first viewport, including mobile (Nombre field measured at about 760px on 390x844).
- **Do** write labels in sentence case at normal tracking; the form's tracked uppercase label style is neutralised inside the glass sheet.
- **Do** use New Aqua as text only on Aztec, the Aztec veil or the closing gradient; on light surfaces use Aztec or Dull Teal.
- **Do** pill every pressable control (999px), round large surfaces at 22px (plates 28px) and nested data panels at 14px.
- **Do** recolor the shared form through CSS variables on the sheet wrapper, never by forking the component.
- **Do** paint the grid of lines and nodes as a background-image at 25% #D8ECE9, masked to fade toward the left.
- **Do** pair the cover photo with the house the headline price names (entry house that has a photo).
- **Do** take icons only from the custom Propyte icon set once it exists as SVG.

### Don't:
- **Don't** use uppercase tracked eyebrows or kickers above blocks.
- **Don't** split the first view 50/50 with a dark form panel, build grids of identical cards, or number steps 01/02/03.
- **Don't** invent urgency (counters, "quedan 2") or testimonials, and don't name developments or developers.
- **Don't** hardcode prices or counts in copy.
- **Don't** use hard offset shadows; depth is glass, veil and soft ambient shadow only.
- **Don't** use Aureoline Yellow or Bright Pastel Green on these landings; they belong to Propyte MX and Propyte Market.
- **Don't** treat Lucide as the system's icon language; it is a placeholder.
- **Don't** add new `!important` overrides; the ones on the form shell are inherited debt.

## Open items

- **Icon set.** The manual allows only its own custom icon set, not yet available as SVG. Lucide icons in the data table and chips are a temporary placeholder; swap when the set is delivered.
- **Fonts.** Neue Haas Grotesk Display Pro and Normalidad VF are paid; Inter and DM Sans stand in site-wide.
- **Divergence from OWN-WORLD block.** The direction contract still names white paper, blueprint blue and Archivo/Hanken; the build and this file supersede it.
