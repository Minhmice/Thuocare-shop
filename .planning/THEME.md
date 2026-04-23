---
name: Healthcare & Wellness Design System
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f1'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#404945'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#296956'
  primary: '#003428'
  on-primary: '#ffffff'
  primary-container: '#004d3c'
  on-primary-container: '#7dbda7'
  inverse-primary: '#93d3bd'
  secondary: '#3e6752'
  on-secondary: '#ffffff'
  secondary-container: '#c0edd2'
  on-secondary-container: '#446d57'
  tertiary: '#252f2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b4542'
  on-tertiary-container: '#a7b2ae'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aff0d8'
  primary-fixed-dim: '#93d3bd'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#07513f'
  secondary-fixed: '#c0edd2'
  secondary-fixed-dim: '#a4d0b7'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#264e3b'
  tertiary-fixed: '#dae5e0'
  tertiary-fixed-dim: '#bec9c4'
  on-tertiary-fixed: '#141d1b'
  on-tertiary-fixed-variant: '#3f4946'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e0'
typography:
  display-xl:
    fontFamily: Manrope
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1'
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
  md: 24px
  lg: 48px
  xl: 80px
  section: 120px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is rooted in the intersection of clinical precision and holistic wellness. It aims to evoke an immediate sense of trust, security, and calm for patients and providers alike. The visual language balances high-end professional healthcare standards with a modern, approachable editorial feel.

The chosen style is **Minimalism with a Corporate Modern twist**. It utilizes significant whitespace to reduce cognitive load—essential in a healthcare context—while employing sophisticated color blocking and high-quality photography to establish authority. The aesthetic is clean and organized, ensuring that critical medical information is never obscured by decorative elements.

## Colors

The palette is anchored by a "Deep Forest Green," which provides a sense of growth, stability, and professional maturity. This is contrasted against "Clean Whites" and "Bone" neutrals to maintain a sterile, high-clarity environment.

*   **Primary:** A deep, rich green used for high-impact surfaces like the hero background, footers, and primary call-to-action buttons.
*   **Secondary:** A soft mint green used for accents, badges, or hover states to provide a gentle visual lift.
*   **Neutral:** Deep charcoals for typography to ensure maximum legibility, and soft grey-greens for borders and secondary backgrounds.
*   **Functional:** A pure white is reserved for cards and content containers to make them pop against the off-white page background.

## Typography

The design system exclusively utilizes **Manrope** to maintain a modern and highly legible interface. This typeface was selected for its geometric balance and open counters, which perform exceptionally well across both large-scale headlines and dense medical body text.

Headlines use a tighter letter-spacing and heavier weights to command attention, while body copy is set with generous line-height to ensure readability for users of all ages and visual abilities. Labels and navigation items utilize a slight tracking increase and semi-bold weights for quick scannability.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop, centered within a 1280px container, utilizing a 12-column structure. 

The spacing philosophy is "Airy and Intentional." Large vertical gaps (120px+) are used between major sections to define the content hierarchy clearly. Internal component spacing follows a strict 8px base grid, ensuring that even complex information layouts feel structured and rhythmic rather than cluttered. Margins are kept wide to drive the user's eye toward the central content.

## Elevation & Depth

To maintain a clean and modern healthcare aesthetic, the design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

*   **Depth through Overlap:** Instead of using shadows to lift elements, the design system uses spatial positioning. Images and cards may partially overlap background color blocks to create a sophisticated, 3D editorial feel.
*   **Subtle Outlines:** Components like input fields or secondary cards use 1px borders in a soft neutral-green rather than drop shadows.
*   **Soft Elevations:** Where depth is required (e.g., a floating navigation bar or a dropdown), a very diffused, low-opacity (4-8%) ambient shadow tinted with the primary green is used to maintain a soft, non-aggressive presence.

## Shapes

The shape language is defined by **Rounded** corners. This approach strikes a balance between the precision of "Sharp" edges and the playfulness of "Pill" shapes.

*   **Primary Containers:** Standard cards and images utilize a 0.5rem (8px) radius.
*   **Interactive Elements:** Buttons and form inputs follow a slightly more pronounced rounding (up to 1rem) to feel "touchable" and friendly.
*   **Accents:** Circular elements are used sparingly for decorative badges (like "Scroll Down" indicators) to provide a soft contrast to the otherwise structured grid.

## Components

### Hero Section
The Hero utilizes a split-background or full-bleed Primary Green background. Text is consistently high-contrast White. A primary image should be featured with a "cut-out" effect or an overlapping card to create depth.

### Feature Cards
Feature cards are primarily White with a subtle border or a very faint grey-green background. They include a small icon (line-art style), a Headline-MD, and Body-MD text. Cards should have a subtle scale-up transition on hover to indicate interactivity.

### Buttons
*   **Primary:** Solid Primary Green (or White if on a Green background) with semi-bold text. Rounded corners.
*   **Secondary:** Ghost style with a 1px border.
*   **Tertiary/Text:** Simple text with a small trailing arrow icon for "Read More" links.

### Footer
The footer is a heavy, dark-themed block using the Primary Green. It organizes information into clear columns (Sitemap, Contact, Social) and features secondary buttons for app downloads.

### Input Fields
Inputs are clean with a secondary background color (#E8F3EE) and no shadow. The focus state is indicated by a 2px Primary Green border.