---
name: Elemental Harmony
colors:
  surface: '#131410'
  surface-dim: '#131410'
  surface-bright: '#3a3935'
  surface-container-lowest: '#0e0e0b'
  surface-container-low: '#1c1c18'
  surface-container: '#20201c'
  surface-container-high: '#2a2a26'
  surface-container-highest: '#353530'
  on-surface: '#e5e2db'
  on-surface-variant: '#e4beb9'
  inverse-surface: '#e5e2db'
  inverse-on-surface: '#31312c'
  outline: '#ab8984'
  outline-variant: '#5b403c'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#ff5546'
  on-primary-container: '#5c0002'
  inverse-primary: '#b91e19'
  secondary: '#8ccef8'
  on-secondary: '#00344a'
  secondary-container: '#005e82'
  on-secondary-container: '#93d5ff'
  tertiary: '#b7ce9e'
  on-tertiary: '#233513'
  tertiary-container: '#81986b'
  on-tertiary-container: '#1d2f0c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930006'
  secondary-fixed: '#c5e7ff'
  secondary-fixed-dim: '#8ccef8'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#004c6a'
  tertiary-fixed: '#d2eab8'
  tertiary-fixed-dim: '#b7ce9e'
  on-tertiary-fixed: '#0f2002'
  on-tertiary-fixed-variant: '#394c27'
  background: '#131410'
  on-background: '#e5e2db'
  surface-variant: '#353530'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system draws from the four elemental nations, balancing traditional organic textures with modern cinematic glassmorphism. The brand personality is epic, balanced, and spiritual, aiming to evoke a sense of journey and elemental mastery.

The visual style is **Cinematic Minimalist with Tactile accents**. It utilizes high-quality photography of natural elements (flowing water, jagged rock, flickering embers, swirling clouds) filtered through frosted glass layers. Surfaces feel like polished stone or ancient parchment preserved behind modern crystal.

## Colors
The palette is organized by the four elements, set against a deep charcoal and parchment foundation.

- **Fire (Primary):** Crimson (#E03C31) used for high-impact CTAs and critical alerts.
- **Water (Secondary):** Deep Ocean Blue (#005E82) used for primary navigation and interactive links.
- **Earth (Tertiary):** Moss and Clay (#5C7148) used for success states and secondary UI accents.
- **Air (Accent):** Sky Blue (#A1C4D0) used for subtle highlights and informational badges.
- **Surface:** The background uses a "Deep Carbon" (#0F1113) base with "Parchment" (#F4F1EA) used exclusively for high-readability text and elegant dividers.

## Typography
The typography system creates a "Modern Manuscript" feel. 

**Libre Caslon Text** is used for headlines, providing a sharp, authoritative, and slightly calligraphic serif feel that echoes ancient scrolls. 

**Hanken Grotesk** provides a high-performance, contemporary contrast for body copy. It is clean and legible, ensuring that the thematic elements do not overwhelm the utility of the information. Use `label-caps` for small descriptors, category tags, and navigation items to maintain a sophisticated, curated look.

## Layout & Spacing
The design system utilizes a **Fixed Grid** with generous white space to evoke the vastness of the elemental world.

- **Desktop:** 12-column grid, 1280px max-width, 64px side margins.
- **Tablet:** 8-column grid, 32px side margins.
- **Mobile:** 4-column grid, 16px side margins.

Vertical rhythm follows a strictly modular 8px scale. Layouts should favor asymmetrical compositions—placing large headline elements against expansive backgrounds to create a "Cinematic" frame. Elements should feel uncrowded, like a single brushstroke on a canvas.

## Elevation & Depth
Depth is communicated through **Glassmorphism and Tonal Layering** rather than traditional drop shadows.

1.  **Base Layer:** The Deep Carbon background, occasionally textured with a faint, low-opacity "parchment grain."
2.  **Surface Layer:** Semi-transparent containers (Background blur: 20px, Opacity: 10%) with a 1px inner border of white at 15% opacity to simulate the edge of glass or polished ice.
3.  **Floating Layer:** Elements that require focus (Modals, Hovered Cards) use a secondary "Glow" shadow. The shadow color should match the element's associated nation color (e.g., a Water Tribe card emits a soft #005E82 glow).

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. While the world is elemental and organic, the "Modern" aspect of the design requires precision. 

Avoid perfect circles for everything except progress indicators or avatars. Use sharp 90-degree angles for the outer containers of the layout, but "Soft" 4px or 8px corners for internal components like cards and buttons to provide a touch of approachability.

## Components

### Buttons
- **Primary (Fire):** High-contrast crimson background, white text. No shadow, but uses a subtle 2px "inner-glow" on hover to simulate heat.
- **Secondary (Water):** Deep ocean blue border (2px) with a blurred glass background. Text in the same blue.

### Elegant Cards
Cards feature a "Nation Accent" border. A thin 4px vertical stripe on the left edge indicates the element type (Crimson for Fire, Earth for Green, etc.). The body of the card is a frosted glass surface.

### Navigation
The navigation bar is a fixed "Floating Isle" at the top or side. It uses a high backdrop blur (32px) and no background color, appearing only as a subtle distortion over the elemental photography behind it.

### Input Fields
Fields are "Underlined" style, drawing inspiration from calligraphy strokes. On focus, the underline transforms into a dual-tone gradient representing the active element.

### Elemental Chips
Small, pill-shaped badges used for tagging. They should use a low-opacity version of the nation color with high-contrast text. For example, a "Water" tag has a 20% opacity blue background and a 100% opacity blue text label.