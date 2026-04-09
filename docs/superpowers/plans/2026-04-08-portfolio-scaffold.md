# Portfolio Site — Initial Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js 14 App Router portfolio site for an engraving artist with DatoCMS content integration, a Resend-powered contact form, and four placeholder pages (Home, Portfolio, About, Contact).

**Architecture:** Server components fetch data via DatoCMS GraphQL at build/request time; all CMS images are rendered exclusively through `react-datocms <Image>` to route bandwidth through DatoCMS's CDN rather than Vercel's. The contact form is a client component that POSTs to a Next.js API route which calls Resend.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `@datocms/cda-client`, `react-datocms`, `resend`

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: HTML shell, font config, `<Header>`, `<Footer>` |
| `app/page.tsx` | Home page: hero section + featured portfolio pieces |
| `app/portfolio/page.tsx` | Portfolio/Gallery page: full grid of all portfolio pieces |
| `app/about/page.tsx` | About page: bio text + photo from CMS |
| `app/contact/page.tsx` | Contact page: renders `<ContactForm>` |
| `app/api/contact/route.ts` | POST handler: receives form data, sends via Resend |
| `components/layout/Header.tsx` | Nav bar with links to all four pages |
| `components/layout/Footer.tsx` | Footer with copyright + social links placeholder |
| `components/home/HeroSection.tsx` | Full-bleed hero using react-datocms `<Image>` |
| `components/portfolio/GalleryGrid.tsx` | Responsive CSS grid wrapper |
| `components/portfolio/PortfolioCard.tsx` | Card: react-datocms `<Image>` + title/medium/year |
| `components/contact/ContactForm.tsx` | `"use client"` form with state + fetch to `/api/contact` |
| `lib/datocms.ts` | DatoCMS client init + `performQuery` helper |
| `lib/types.ts` | TypeScript interfaces for all CMS data shapes |
| `styles/globals.css` | Tailwind directives |
| `.env.local.example` | All required env var keys with empty values |
| `README.md` | Local dev setup + DatoCMS image rule |

---

## DatoCMS Content Model Spec

> This is a written specification. Create these models manually in the DatoCMS UI (Content → Edit Model).

### Model 1: `portfolio_piece` (repeating content)

| Field name | DatoCMS type | Required | Notes |
|---|---|---|---|
| `title` | Single-line string | Yes | Display title |
| `slug` | Slug | Yes | Auto-generated from title; must be unique |
| `cover_image` | Single asset (image) | Yes | Primary image — rendered via react-datocms `<Image>` |
| `gallery_images` | Gallery (multiple assets) | No | Additional images for detail view (future) |
| `description` | Structured text | No | Long-form piece description |
| `medium` | Single-line string | No | e.g. "Glass", "Metal", "Wood" |
| `dimensions` | Single-line string | No | e.g. "8×10 inches" |
| `year` | Integer | No | Year completed |
| `featured` | Boolean | No | Default `false`; `true` = appears on homepage |
| `display_order` | Integer | No | Manual sort order for gallery |

### Model 2: `site_settings` (singleton)
"Could not use site_settings, datocms requires name to be singular, so model name is site_setting"
| Field name | DatoCMS type | Required | Notes |
|---|---|---|---|
| `site_title` | Single-line string | Yes | `<title>` tag base |
| `tagline` | Single-line string | No | Subtitle under site title |
| `hero_headline` | Single-line string | No | Homepage H1 |
| `hero_subheadline` | Single-line string | No | Homepage sub-copy |
| `hero_image` | Single asset (image) | No | Homepage hero background — react-datocms `<Image>` |
| `about_text` | Structured text | No | About page body |
| `about_photo` | Single asset (image) | No | Artist photo — react-datocms `<Image>` |
| `instagram_url` | Single-line string | No | Instagram profile URL |

---

## Environment Variables

All keys that must exist in `.env.local` (values set after DatoCMS/Resend accounts are configured):

```
# DatoCMS — Read-only CDA token
# Source: DatoCMS project → Settings → API Tokens → read-only token
DATOCMS_API_TOKEN=

# Resend — transactional email
# Source: Resend dashboard → API Keys
RESEND_API_KEY=

# Verified sender address (must be a domain verified in Resend)
RESEND_FROM_EMAIL=

# Destination for contact form submissions
RESEND_TO_EMAIL=
```

---

## Task 1: Bootstrap Next.js 14

**Files:**
- Create: (full project root via `create-next-app`)

- [ ] **Step 1: Run create-next-app**

```bash
cd d:/DEV/Dustin-K-Portfolio
npx create-next-app@14 . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-git \
  --yes
```

Expected: scaffolds `app/`, `components/` (empty), `public/`, `tailwind.config.ts`, `tsconfig.json`, `next.config.js`, `package.json`.

- [ ] **Step 2: Verify the dev server starts**

```bash
npm run dev
```

Expected: `ready on http://localhost:3000` — visit in browser, see default Next.js page.

- [ ] **Step 3: Delete default boilerplate**

Remove the generated placeholder content but keep the file structure:
- Clear `app/page.tsx` to a minimal returning `<main>` with `<p>[PLACEHOLDER] Home</p>`
- Clear `app/globals.css` to only Tailwind directives (see Task 2)
- Delete `public/vercel.svg` and `public/next.svg`

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: bootstrap Next.js 14 App Router with TypeScript + Tailwind"
```

---

## Task 2: Install domain dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install the three required packages**

```bash
npm install @datocms/cda-client react-datocms resend
```

Expected: three packages added to `dependencies` in `package.json`. No other packages.

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: exits 0 with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add datocms, react-datocms, and resend dependencies"
```

---

## Task 3: Environment variable files

**Files:**
- Create: `.env.local.example`
- Create: `.env.local` (gitignored)

- [ ] **Step 1: Create `.env.local.example`**

```
# DatoCMS — Read-only CDA token
# Source: DatoCMS project → Settings → API Tokens → read-only token
DATOCMS_API_TOKEN=

# Resend — transactional email
# Source: Resend dashboard → API Keys
RESEND_API_KEY=

# Verified sender address (must be a domain verified in Resend)
RESEND_FROM_EMAIL=

# Destination for contact form submissions
RESEND_TO_EMAIL=
```

- [ ] **Step 2: Create `.env.local` from the example**

```bash
cp .env.local.example .env.local
```

Fill in real values if accounts are available; leave empty otherwise — the app will still boot, pages just won't load CMS data.

- [ ] **Step 3: Verify `.env.local` is gitignored**

`create-next-app` adds `.env*.local` to `.gitignore` by default. Confirm:

```bash
grep "env.local" .gitignore
```

Expected: `.env*.local` is present.

- [ ] **Step 4: Commit**

```bash
git add .env.local.example .gitignore
git commit -m "chore: add env var template"
```

---

## Task 4: DatoCMS client and TypeScript types

**Files:**
- Create: `lib/datocms.ts`
- Create: `lib/types.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
// lib/types.ts

export interface DatoCmsResponsiveImage {
  src: string;
  width: number;
  height: number;
  alt: string | null;
  title: string | null;
  base64: string | null;
  bgColor: string | null;
  sizes: string;
  srcSet: string;
  webpSrcSet: string;
}

export interface PortfolioPiece {
  id: string;
  title: string;
  slug: string;
  coverImage: {
    responsiveImage: DatoCmsResponsiveImage;
  };
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  featured: boolean;
  displayOrder: number | null;
  description: unknown | null; // StructuredText document — typed by react-datocms at render time
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string | null;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  heroImage: {
    responsiveImage: DatoCmsResponsiveImage;
  } | null;
  aboutText: unknown | null; // StructuredText document
  aboutPhoto: {
    responsiveImage: DatoCmsResponsiveImage;
  } | null;
  instagramUrl: string | null;
}
```

- [ ] **Step 2: Create `lib/datocms.ts`**

```typescript
// lib/datocms.ts
import { buildClient } from '@datocms/cda-client';

if (!process.env.DATOCMS_API_TOKEN) {
  console.warn('DATOCMS_API_TOKEN is not set — CMS queries will fail');
}

const client = buildClient({
  apiToken: process.env.DATOCMS_API_TOKEN ?? '',
});

export async function performQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return client.request<T>(query, variables ?? {});
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add lib/datocms.ts lib/types.ts
git commit -m "feat: add DatoCMS client and TypeScript types"
```

---

## Task 5: Root layout, Header, Footer

**Files:**
- Modify: `app/layout.tsx`
- Modify: `styles/globals.css`
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Write `styles/globals.css`**

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Write `components/layout/Header.tsx`**

```typescript
// components/layout/Header.tsx
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          [PLACEHOLDER] Artist Name
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write `components/layout/Footer.tsx`**

```typescript
// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} [PLACEHOLDER] Artist Name. All rights reserved.</p>
        <p className="mt-1">[PLACEHOLDER] Social links</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Write `app/layout.tsx`**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '[PLACEHOLDER] Artist Name — Engraving',
  description: '[PLACEHOLDER] Portfolio of engraving work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white text-gray-900`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Visit `http://localhost:3000` — should show header nav and footer on every page.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx styles/globals.css components/layout/Header.tsx components/layout/Footer.tsx
git commit -m "feat: add root layout with header and footer"
```

---

## Task 6: Home page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/HeroSection.tsx`

- [ ] **Step 1: Write `components/home/HeroSection.tsx`**

```typescript
// components/home/HeroSection.tsx
// IMPORTANT: Uses react-datocms Image — NOT next/image
import { Image as DatoCmsImage } from 'react-datocms';
import type { DatoCmsResponsiveImage } from '@/lib/types';

interface HeroSectionProps {
  headline: string | null;
  subheadline: string | null;
  image: { responsiveImage: DatoCmsResponsiveImage } | null;
}

export default function HeroSection({ headline, subheadline, image }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '60vh' }}>
      {image ? (
        <DatoCmsImage
          data={image.responsiveImage}
          className="absolute inset-0 h-full w-full object-cover"
          pictureClassName="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-100" />
      )}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl">
          {headline ?? '[PLACEHOLDER] Headline'}
        </h1>
        {subheadline && (
          <p className="mt-4 text-lg text-white/90 drop-shadow">{subheadline}</p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `app/page.tsx`**

```typescript
// app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import { performQuery } from '@/lib/datocms';
import type { SiteSettings, PortfolioPiece } from '@/lib/types';

const HOME_QUERY = `
  query HomeQuery {
    siteSettings {
      heroHeadline
      heroSubheadline
      heroImage {
        responsiveImage(imgixParams: { w: 1400, fit: crop, auto: format }) {
          src
          width
          height
          alt
          title
          base64
          bgColor
          sizes
          srcSet
          webpSrcSet
        }
      }
    }
    allPortfolioPieces(filter: { featured: { eq: true } }, orderBy: displayOrder_ASC) {
      id
      title
      slug
      coverImage {
        responsiveImage(imgixParams: { w: 600, h: 600, fit: crop, auto: format }) {
          src
          width
          height
          alt
          title
          base64
          bgColor
          sizes
          srcSet
          webpSrcSet
        }
      }
      medium
      year
    }
  }
`;

interface HomeQueryResult {
  siteSettings: Pick<SiteSettings, 'heroHeadline' | 'heroSubheadline' | 'heroImage'> | null;
  allPortfolioPieces: Pick<PortfolioPiece, 'id' | 'title' | 'slug' | 'coverImage' | 'medium' | 'year'>[];
}

export default async function HomePage() {
  let data: HomeQueryResult | null = null;

  if (process.env.DATOCMS_API_TOKEN) {
    data = await performQuery<HomeQueryResult>(HOME_QUERY);
  }

  const settings = data?.siteSettings ?? null;
  const featured = data?.allPortfolioPieces ?? [];

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline ?? null}
        subheadline={settings?.heroSubheadline ?? null}
        image={settings?.heroImage ?? null}
      />

      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900">Featured Work</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((piece) => (
              <div key={piece.id} className="rounded overflow-hidden border border-gray-200">
                {/* PortfolioCard component wired in Task 7 */}
                <p className="p-4 text-sm text-gray-600">[PLACEHOLDER] {piece.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-400">
          <p>[PLACEHOLDER] Featured work will appear here once DatoCMS is configured.</p>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000` — hero renders (gray box if no CMS token). No TypeScript errors:

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/home/HeroSection.tsx
git commit -m "feat: add home page with hero section and featured pieces placeholder"
```

---

## Task 7: Portfolio/Gallery page

**Files:**
- Create: `app/portfolio/page.tsx`
- Create: `components/portfolio/GalleryGrid.tsx`
- Create: `components/portfolio/PortfolioCard.tsx`

- [ ] **Step 1: Write `components/portfolio/PortfolioCard.tsx`**

```typescript
// components/portfolio/PortfolioCard.tsx
// IMPORTANT: Uses react-datocms Image — NOT next/image
import { Image as DatoCmsImage } from 'react-datocms';
import type { PortfolioPiece } from '@/lib/types';

type PortfolioCardProps = Pick<
  PortfolioPiece,
  'title' | 'coverImage' | 'medium' | 'year'
>;

export default function PortfolioCard({ title, coverImage, medium, year }: PortfolioCardProps) {
  return (
    <article className="group overflow-hidden rounded border border-gray-200 bg-white transition hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <DatoCmsImage
          data={coverImage.responsiveImage}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          pictureClassName="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {[medium, year].filter(Boolean).join(' · ')}
        </p>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Write `components/portfolio/GalleryGrid.tsx`**

```typescript
// components/portfolio/GalleryGrid.tsx
import PortfolioCard from './PortfolioCard';
import type { PortfolioPiece } from '@/lib/types';

interface GalleryGridProps {
  pieces: Pick<PortfolioPiece, 'id' | 'title' | 'coverImage' | 'medium' | 'year'>[];
}

export default function GalleryGrid({ pieces }: GalleryGridProps) {
  if (pieces.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">
        [PLACEHOLDER] Portfolio pieces will appear here once DatoCMS is configured.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pieces.map((piece) => (
        <PortfolioCard key={piece.id} {...piece} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write `app/portfolio/page.tsx`**

```typescript
// app/portfolio/page.tsx
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import { performQuery } from '@/lib/datocms';
import type { PortfolioPiece } from '@/lib/types';

const PORTFOLIO_QUERY = `
  query PortfolioQuery {
    allPortfolioPieces(orderBy: displayOrder_ASC) {
      id
      title
      slug
      coverImage {
        responsiveImage(imgixParams: { w: 600, h: 600, fit: crop, auto: format }) {
          src
          width
          height
          alt
          title
          base64
          bgColor
          sizes
          srcSet
          webpSrcSet
        }
      }
      medium
      year
    }
  }
`;

interface PortfolioQueryResult {
  allPortfolioPieces: Pick<
    PortfolioPiece,
    'id' | 'title' | 'slug' | 'coverImage' | 'medium' | 'year'
  >[];
}

export const metadata = {
  title: '[PLACEHOLDER] Portfolio — Artist Name',
};

export default async function PortfolioPage() {
  let pieces: PortfolioQueryResult['allPortfolioPieces'] = [];

  if (process.env.DATOCMS_API_TOKEN) {
    const data = await performQuery<PortfolioQueryResult>(PORTFOLIO_QUERY);
    pieces = data.allPortfolioPieces;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">Portfolio</h1>
      <GalleryGrid pieces={pieces} />
    </div>
  );
}
```

- [ ] **Step 4: Update `app/page.tsx` to use `PortfolioCard`**

In `app/page.tsx`, replace the featured piece placeholder comment block:

```typescript
// Replace this block in the featured.map():
<div key={piece.id} className="rounded overflow-hidden border border-gray-200">
  {/* PortfolioCard component wired in Task 7 */}
  <p className="p-4 text-sm text-gray-600">[PLACEHOLDER] {piece.title}</p>
</div>
```

With:

```typescript
import PortfolioCard from '@/components/portfolio/PortfolioCard';

// ...in the map:
<PortfolioCard
  key={piece.id}
  title={piece.title}
  coverImage={piece.coverImage}
  medium={piece.medium}
  year={piece.year}
/>
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/portfolio` — grid renders placeholder message or real cards. No TypeScript errors:

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add app/portfolio/page.tsx components/portfolio/GalleryGrid.tsx components/portfolio/PortfolioCard.tsx app/page.tsx
git commit -m "feat: add portfolio/gallery page with GalleryGrid and PortfolioCard"
```

---

## Task 8: About page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Write `app/about/page.tsx`**

```typescript
// app/about/page.tsx
// IMPORTANT: Uses react-datocms Image — NOT next/image
import { Image as DatoCmsImage, StructuredText } from 'react-datocms';
import { performQuery } from '@/lib/datocms';
import type { SiteSettings } from '@/lib/types';

const ABOUT_QUERY = `
  query AboutQuery {
    siteSettings {
      aboutText { value }
      aboutPhoto {
        responsiveImage(imgixParams: { w: 600, h: 600, fit: crop, auto: format }) {
          src
          width
          height
          alt
          title
          base64
          bgColor
          sizes
          srcSet
          webpSrcSet
        }
      }
    }
  }
`;

interface AboutQueryResult {
  siteSettings: Pick<SiteSettings, 'aboutText' | 'aboutPhoto'> | null;
}

export const metadata = {
  title: '[PLACEHOLDER] About — Artist Name',
};

export default async function AboutPage() {
  let settings: AboutQueryResult['siteSettings'] = null;

  if (process.env.DATOCMS_API_TOKEN) {
    const data = await performQuery<AboutQueryResult>(ABOUT_QUERY);
    settings = data.siteSettings;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">About</h1>

      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        {settings?.aboutPhoto ? (
          <div className="w-full flex-shrink-0 md:w-64">
            <DatoCmsImage
              data={settings.aboutPhoto.responsiveImage}
              className="rounded-lg"
              pictureClassName="rounded-lg"
            />
          </div>
        ) : (
          <div className="h-64 w-full flex-shrink-0 rounded-lg bg-gray-100 md:w-64 flex items-center justify-center text-gray-400 text-sm">
            [PLACEHOLDER] Artist photo
          </div>
        )}

        <div className="prose prose-gray max-w-none">
          {settings?.aboutText ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <StructuredText data={settings.aboutText as any} />
          ) : (
            <p className="text-gray-400">[PLACEHOLDER] About text will appear here once DatoCMS is configured.</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/about` — photo placeholder and text placeholder render. No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add about page with CMS bio text and photo"
```

---

## Task 9: Contact page + API route

**Files:**
- Create: `app/contact/page.tsx`
- Create: `components/contact/ContactForm.tsx`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Write `components/contact/ContactForm.tsx`**

```typescript
// components/contact/ContactForm.tsx
'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setState('success');
      form.reset();
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMessage(json.error ?? 'Something went wrong. Please try again.');
      setState('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {state === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>

      {state === 'success' && (
        <p className="text-sm text-green-600">Message sent! We'll be in touch soon.</p>
      )}
      {state === 'error' && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Write `app/api/contact/route.ts`**

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.message !== 'string') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, message } = body as { name: string; email: string; message: string };

  if (!name.trim() || !email.trim() || !message.trim()) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.RESEND_TO_EMAIL) {
    console.error('Missing Resend environment variables');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.RESEND_TO_EMAIL,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Write `app/contact/page.tsx`**

```typescript
// app/contact/page.tsx
import ContactForm from '@/components/contact/ContactForm';

export const metadata = {
  title: '[PLACEHOLDER] Contact — Artist Name',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Contact</h1>
      <p className="mb-8 text-sm text-gray-500">
        [PLACEHOLDER] Contact intro text — commissions, questions, etc.
      </p>
      <ContactForm />
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/contact` — form renders. Submitting without Resend env vars returns 503 (expected). No TypeScript errors:

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add app/contact/page.tsx components/contact/ContactForm.tsx app/api/contact/route.ts
git commit -m "feat: add contact page with Resend-backed API route"
```

---

## Task 10: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

````markdown
# [PLACEHOLDER] Artist Name — Portfolio Site

Next.js 14 portfolio for an engraving artist. Built with DatoCMS (content), Resend (contact form), and Tailwind CSS.

## Local dev setup

### Prerequisites
- Node.js 18+
- A DatoCMS account and project
- A Resend account with a verified sender domain

### 1. Clone and install

```bash
git clone <repo>
cd <repo>
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `DATOCMS_API_TOKEN` | DatoCMS → Settings → API Tokens → read-only CDA token |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | A sender address on a domain verified in Resend |
| `RESEND_TO_EMAIL` | Where contact form submissions should land |

### 3. Configure DatoCMS content models

See the [DatoCMS Content Model Spec](docs/superpowers/plans/2026-04-08-portfolio-scaffold.md) for the exact fields to create.

Create two models in DatoCMS:
- `portfolio_piece` (repeating)
- `site_settings` (singleton)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## ⚠️ Critical: DatoCMS image rule

**NEVER use `next/image` to render DatoCMS images.** Always use the `<Image>` component from `react-datocms`:

```typescript
// ✅ Correct
import { Image as DatoCmsImage } from 'react-datocms';
<DatoCmsImage data={piece.coverImage.responsiveImage} />

// ❌ Wrong — routes bandwidth through Vercel, incurs costs
import Image from 'next/image';
<Image src={piece.coverImage.url} ... />
```

DatoCMS's `responsiveImage` field serves images via DatoCMS's CDN. Using `next/image` forces those images through Vercel's image optimization pipeline, which can generate significant bandwidth charges at scale.

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add all `.env.local` keys as Vercel environment variables
4. Deploy
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions and DatoCMS image rule"
```

---

## Self-Review Checklist

### Spec coverage
- [x] Next.js 14 App Router + TypeScript + Tailwind — Task 1
- [x] DatoCMS client via `@datocms/cda-client` — Task 4
- [x] `react-datocms <Image>` used in all image components — HeroSection (Task 6), PortfolioCard (Task 7), About (Task 8)
- [x] `next/image` never used — confirmed, not imported anywhere
- [x] Resend contact form API route — Task 9
- [x] Home, Portfolio, About, Contact pages — Tasks 6–9
- [x] DatoCMS content model spec — written above
- [x] `.env.local.example` — Task 3
- [x] README — Task 10
- [x] No pages/ directory — all routes use App Router `app/` conventions
- [x] `[PLACEHOLDER]` tokens throughout — no placeholder business copy written as real text

### Placeholder scan
- All CMS-dependent text uses `[PLACEHOLDER]` tokens — confirmed
- No "TBD" or "implement later" language — confirmed

### Type consistency
- `DatoCmsResponsiveImage` defined in `lib/types.ts` and used consistently in all component props
- `PortfolioPiece` and `SiteSettings` interfaces match query field names
- `performQuery<T>` generic matches all call sites
