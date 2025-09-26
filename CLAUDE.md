# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BibiGin is a premium single-product e-commerce website for an artisanal gin brand inspired by lunar phases. The site features a sophisticated astronomical theme with navy blue (#1B2951) and gold (#D4AF37) branding colors derived from the logo.

## Essential Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Production build with Turbopack  
npm run start        # Start production server
npm run lint         # Run ESLint

# Development server runs on http://localhost:3000
```

## Architecture & Technology Stack

**Framework**: Next.js 15 with App Router and Turbopack
**Styling**: Tailwind CSS v4 (inline theme configuration in globals.css)
**UI Components**: shadcn/ui with "new-york" style variant
**Animations**: Framer Motion for premium page transitions and micro-interactions
**Typography**: Playfair Display (premium font) + Geist Sans + Geist Mono
**Icons**: Lucide React

## Code Architecture

### Component Structure
- **`/src/components/bibigin/`** - Custom BibiGin brand components
- **`/src/components/ui/`** - shadcn/ui base components 
- **`/src/components/bibigin/index.ts`** - Barrel export for all BibiGin components

### Key Components
- **Header**: Fixed transparent header with mobile navigation sheet
- **Hero**: Full-screen landing with animated star background
- **ProductShowcase**: Detailed product information with botanicals and tasting notes
- **Story**: Brand narrative with lunar phase process explanation
- **Reviews**: Customer testimonials with statistics
- **CartDrawer**: E-commerce cart functionality with sheet drawer
- **Footer**: Brand information and contact details

### Design System
- **Color scheme**: Unified theme (no dark/light mode) using logo-derived colors
- **Navy Blue**: `oklch(0.18 0.02 265)` - Primary brand color
- **Gold**: `oklch(0.73 0.15 85)` - Accent color  
- **Cosmic gradient backgrounds**: Used throughout with animated stars
- **Star animations**: Deterministic positioning to avoid hydration mismatches

### State Management
Cart state is managed in the main page component and passed down through props. Cart operations include add, update quantity, remove, and checkout flow.

### Responsive Design
Mobile-first approach with specific breakpoints for tablet and desktop. All components are fully responsive with touch-friendly interactions.

## Technical Implementation Notes

### Hydration Considerations
Star background animations use deterministic position calculation (not Math.random()) to prevent server/client hydration mismatches. Each component has its own `generateStarPositions` function with unique mathematical formulas.

### Accessibility
All Sheet components include proper `SheetTitle` and `SheetDescription` for screen reader compatibility. ESLint enforces escaped characters for quotes and apostrophes.

### Animation Patterns
- **fadeInUp**: Standard component entrance animation
- **stagger**: Sequential animation for lists and grids  
- **Deterministic star fields**: Background ambient animations
- **Hover effects**: Interactive elements with scale and glow transforms

### Brand Consistency
- Use `font-playfair` for headings and luxury typography
- Maintain navy/gold color scheme throughout
- Apply cosmic gradient backgrounds: `bg-cosmic-gradient` and `bg-navy-gradient`
- Use `text-secondary` instead of `text-cream` for consistency

### E-commerce Features
Single-product cart system with:
- Quantity management
- Price calculations with shipping logic (free shipping over €50)
- Responsive cart drawer
- Mock checkout process

## Development Workflow

When adding new components, follow the existing pattern:
1. Create in `/src/components/bibigin/` 
2. Export from `index.ts`
3. Use consistent color classes (`text-secondary`, `bg-gold`, etc.)
4. Include Framer Motion animations for premium feel
5. Ensure mobile responsiveness
6. Add deterministic star backgrounds if needed

Build process includes ESLint validation and TypeScript checking. All builds must pass without warnings before deployment.