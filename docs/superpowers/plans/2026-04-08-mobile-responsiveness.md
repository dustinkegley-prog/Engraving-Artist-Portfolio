# Mobile Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site look high-end on mobile by adding a full-screen overlay nav and applying five targeted responsive polish fixes.

**Architecture:** Extract a `MobileNav` client component that handles hamburger toggle state and the overlay; `Header` stays a server component and renders `MobileNav` alongside the existing desktop nav. All other changes are Tailwind class-only edits — no structural changes to existing components.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS, React hooks (`useState`, `useEffect`)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `components/layout/MobileNav.tsx` | Hamburger button + full-screen overlay client component |
| Modify | `components/layout/Header.tsx` | Import MobileNav, hide desktop nav on mobile |
| Modify | `components/home/HeroSection.tsx` | Headline scale + subheadline tracking fix |
| Modify | `app/portfolio/[slug]/page.tsx` | Vertical padding on mobile |
| Modify | `app/about/page.tsx` | Vertical padding + photo max-width on mobile |

---

## Task 1: Create MobileNav component

**Files:**
- Create: `components/layout/MobileNav.tsx`

- [ ] **Step 1: Create the component**

Create `components/layout/MobileNav.tsx` with this exact content:

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button — visible on mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-1.5 w-8 h-8 md:hidden"
        aria-label="Open menu"
      >
        <span className="block w-6 h-px bg-stone-100" />
        <span className="block w-6 h-px bg-stone-100" />
        <span className="block w-6 h-px bg-stone-100" />
      </button>

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Close button — positioned to match header padding */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-6 text-stone-400 hover:text-stone-100 transition-colors duration-300"
          aria-label="Close menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col items-center gap-10">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl font-light tracking-[0.15em] text-stone-100 hover:text-gold-400 transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/MobileNav.tsx
git commit -m "feat: add MobileNav full-screen overlay component"
```

---

## Task 2: Wire MobileNav into Header

**Files:**
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: Update Header.tsx**

Replace the entire file content with:

```tsx
// components/layout/Header.tsx
import Link from 'next/link';
import { getSiteSettings } from '@/lib/datocms';
import MobileNav from './MobileNav';

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default async function Header() {
  const settings = await getSiteSettings();
  const name = settings?.siteTitle ?? 'Artist Name';
  const tagline = settings?.tagline ?? 'Engraving Artist';

  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-xl font-light tracking-[0.2em] text-stone-100 uppercase">
            {name}
          </span>
          <span className="text-[10px] tracking-[0.35em] text-gold-500 uppercase mt-0.5">
            {tagline}
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[11px] tracking-[0.25em] uppercase text-stone-400 hover:text-gold-400 transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile nav — hamburger + overlay */}
        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify visually**

```bash
npm run dev
```

Open `http://localhost:3000`. Resize browser to < 768px:
- Hamburger (three lines) appears top-right
- Desktop nav links disappear
- Tapping hamburger opens full-screen dark overlay with Portfolio / About / Contact in large serif
- Tapping ✕ or any link closes the overlay
- Body does not scroll while overlay is open

At ≥ 768px:
- Desktop nav links appear, hamburger is hidden
- No overlay visible

- [ ] **Step 4: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat: wire MobileNav into Header, hide desktop nav on mobile"
```

---

## Task 3: Hero responsive typography

**Files:**
- Modify: `components/home/HeroSection.tsx`

- [ ] **Step 1: Update headline and subheadline classes**

In `components/home/HeroSection.tsx`, make two class changes:

**Headline** (line 35) — change:
```
text-5xl font-light tracking-[0.1em] text-stone-100 sm:text-7xl
```
to:
```
text-4xl font-light tracking-[0.1em] text-stone-100 sm:text-5xl lg:text-7xl
```

**Subheadline** (line 41) — change:
```
text-sm tracking-[0.3em] uppercase text-stone-400 max-w-md
```
to:
```
text-sm tracking-[0.15em] sm:tracking-[0.3em] uppercase text-stone-400 max-w-xs sm:max-w-md
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/HeroSection.tsx
git commit -m "fix: responsive hero typography — smoother type scale, prevent tracking overflow on mobile"
```

---

## Task 4: Portfolio detail page — mobile padding

**Files:**
- Modify: `app/portfolio/[slug]/page.tsx`

- [ ] **Step 1: Update outer wrapper padding**

In `app/portfolio/[slug]/page.tsx`, on the outermost `<div>` (line 59), change:
```
className="mx-auto max-w-5xl px-6 py-20"
```
to:
```
className="mx-auto max-w-5xl px-6 py-12 md:py-20"
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/portfolio/[slug]/page.tsx"
git commit -m "fix: reduce vertical padding on portfolio detail page for mobile"
```

---

## Task 5: About page — mobile padding and photo width

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Update outer wrapper padding**

In `app/about/page.tsx`, on the outermost `<div>` (line 46), change:
```
className="mx-auto max-w-5xl px-6 py-20"
```
to:
```
className="mx-auto max-w-5xl px-6 py-12 md:py-20"
```

- [ ] **Step 2: Update photo wrapper**

On the photo wrapper `<div>` (line 57), change:
```
className="w-full flex-shrink-0 md:w-72"
```
to:
```
className="w-full max-w-sm mx-auto flex-shrink-0 md:max-w-none md:mx-0 md:w-72"
```

Also update the placeholder `<div>` (line 65) to match:
```
className="h-80 w-full max-w-sm mx-auto flex-shrink-0 md:max-w-none md:mx-0 md:w-72 bg-zinc-900 border border-zinc-800 flex items-center justify-center"
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx
git commit -m "fix: reduce about page padding on mobile, cap photo width when stacked"
```

---

## Final Verification

- [ ] **Run full build to confirm no regressions**

```bash
npm run build
```

Expected: Build completes with no errors or type errors.

- [ ] **Manual mobile check at 375px (iPhone SE viewport)**

Open DevTools → Toggle device toolbar → iPhone SE (375px wide). Verify:
- Header: hamburger visible, logo fits without overflow
- Home hero: headline at ~36px (text-4xl), subheadline text doesn't overflow
- Portfolio page: gallery at 1 column, comfortable padding
- Portfolio detail: image fills width, details below, breathing room top/bottom
- About: photo capped at ~384px wide, centered, text stacks below
- Contact: form fits comfortably
- Footer: centered, no overflow
