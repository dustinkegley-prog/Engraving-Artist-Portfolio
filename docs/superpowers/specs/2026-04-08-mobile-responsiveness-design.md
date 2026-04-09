# Mobile Responsiveness Design

**Date:** 2026-04-08  
**Scope:** Option B — Mobile nav overlay + responsive polish  
**Goal:** Site looks high-end on both desktop and mobile

---

## Problem Summary

The site looks good on desktop but has two categories of mobile issues:

1. **Primary:** The header has no mobile navigation. The horizontal nav row (Portfolio · About · Contact) competes with the logo/tagline on small screens. Tap targets are 11px text — too small for fingers.
2. **Secondary:** Several minor typography and spacing issues make the site feel unfinished on narrow phones.

---

## 1. Mobile Navigation Overlay

### Architecture

`Header` remains a server component. A new `MobileNav` client component is extracted to handle toggle state and the overlay. `Header` renders `MobileNav` and passes the nav links array to it as props.

**Files:**
- `components/layout/Header.tsx` — add `MobileNav` import, add hamburger slot, hide desktop nav on mobile
- `components/layout/MobileNav.tsx` — new client component

### MobileNav Behavior

- **Closed state:** Renders a hamburger icon (☰) button in the top-right of the header, visible only on mobile (`md:hidden`).
- **Open state:** Renders a `fixed inset-0 z-[60] bg-zinc-950` full-screen overlay with:
  - Nav links centered vertically and horizontally
  - Link style: `font-serif text-4xl font-light tracking-[0.15em] text-stone-100 hover:text-gold-400 transition-colors`
  - Close button (✕) fixed top-right, matching hamburger position
  - Body scroll locked while open (`overflow-hidden` on `document.body`)
- **Animation:** `transition-opacity duration-300` fade in/out via conditional `opacity-0 pointer-events-none` / `opacity-100`.

### Desktop behavior

- Hamburger button: `md:hidden`
- Existing desktop nav `<ul>`: `hidden md:flex`
- Overlay is never visible on desktop

---

## 2. Responsive Polish

Five targeted Tailwind class changes. No structural changes to any file.

### 2a. Hero headline scale
**File:** `components/home/HeroSection.tsx`  
**Change:** `text-5xl sm:text-7xl` → `text-4xl sm:text-5xl lg:text-7xl`  
**Reason:** 48px (text-5xl) is too large for 320–375px phones. Smoother three-step ramp.

### 2b. Hero subheadline letter-spacing
**File:** `components/home/HeroSection.tsx`  
**Change:** `tracking-[0.3em]` → `tracking-[0.15em] sm:tracking-[0.3em]`  
**Reason:** 0.3em tracking on a sentence-length string overflows viewport width at 320px.

### 2c. Portfolio detail page vertical padding
**File:** `app/portfolio/[slug]/page.tsx`  
**Change:** `py-20` → `py-12 md:py-20`  
**Reason:** 80px top/bottom padding is excessive when content is already full-width stacked on mobile.

### 2d. About page vertical padding
**File:** `app/about/page.tsx`  
**Change:** `py-20` → `py-12 md:py-20`  
**Reason:** Same as above — consistent with detail page.

### 2e. About page photo width on mobile
**File:** `app/about/page.tsx`  
**Change:** Add `max-w-sm mx-auto md:max-w-none md:mx-0` to the photo wrapper div  
**Reason:** Without a max-width, the photo stretches edge-to-edge on wide phones in portrait, which looks unintentional.

---

## Out of Scope

- Portfolio page, Contact page, Footer — these are already responsive.
- Gallery grid — already uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Any desktop layout changes.
- Animation libraries (Framer Motion, etc.) — plain Tailwind transitions only.
