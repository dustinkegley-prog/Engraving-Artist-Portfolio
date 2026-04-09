# Claude Code Instructions — Dustin Kegley Portfolio

## Project

Next.js 14 App Router portfolio site for an engraving artist. Content managed via DatoCMS, contact form via Resend, deployed to Vercel.

## Stack

- **Next.js 14** — App Router only. No `pages/` directory.
- **TypeScript** — strict mode. Run `npx tsc --noEmit` after changes.
- **Tailwind CSS** — custom gold palette (`gold-300` through `gold-700`), dark zinc base, Cormorant Garamond serif font.
- **`@datocms/cda-client` v0.x** — uses `executeQuery(query, { token })`. There is no `buildClient`. See `lib/datocms.ts`.
- **`react-datocms`** — provides the `<Image>` component and `<StructuredText>` renderer.
- **`resend`** — contact form email, handled in `app/api/contact/route.ts`.

## Critical Rules

### Never use `next/image` for DatoCMS images

Always use the `<Image>` component from `react-datocms`:

```tsx
// Correct
import { Image as DatoCmsImage } from 'react-datocms';
<DatoCmsImage data={piece.coverImage.responsiveImage} />

// Wrong — routes bandwidth through Vercel, incurs costs
import Image from 'next/image';
<Image src={piece.coverImage.url} ... />
```

DatoCMS serves images through its own CDN via `responsiveImage`. Using `next/image` forces them through Vercel's image optimization pipeline.

### DatoCMS model names

| DatoCMS model | GraphQL collection query | GraphQL singleton query |
|---|---|---|
| `portfolio_piece` | `allPortfolioPieces` | — |
| `site_setting` (singular — DatoCMS enforces this) | — | `siteSetting` |

### Next.js data cache

All DatoCMS queries bypass the Next.js data cache via a custom `fetchFn` in `lib/datocms.ts`. This ensures content changes appear immediately in dev. For production ISR, change `cache: 'no-store'` to `next: { revalidate: 60 }` in `performQuery`.

## Architecture

### Data fetching

- `lib/datocms.ts` — exports `performQuery<T>()` and `getSiteSettings()`
- `lib/types.ts` — TypeScript interfaces for all CMS shapes (`PortfolioPiece`, `SiteSettings`, `DatoCmsResponsiveImage`)
- All pages are server components that fetch at render time
- `ContactForm` is the only `"use client"` component

### Site settings

`getSiteSettings()` is called in `Header`, `Footer`, and `layout.tsx` (`generateMetadata`). Next.js deduplicates identical fetch calls within a render, so this is one network request per page load despite appearing in multiple places.

### Font setup

Cormorant Garamond (headings) and Inter (body) are loaded via `next/font/google` in `app/layout.tsx` and applied as CSS variables on `<html>`. Tailwind references them by font name string (not CSS variable) in `tailwind.config.ts`:

```typescript
fontFamily: {
  serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  sans: ['Inter', 'sans-serif'],
}
```

### Webpack alias

`next.config.js` stubs `@mux/mux-player-react/lazy` to prevent a build error from `react-datocms` v8's `VideoPlayer` component, which we don't use.

## File Map

```
app/
  layout.tsx              # Root layout: fonts, metadata, Header, Footer
  page.tsx                # Home: hero + featured pieces
  portfolio/page.tsx      # Gallery: all portfolio pieces
  about/page.tsx          # About: bio + photo
  contact/page.tsx        # Contact form page
  api/contact/route.ts    # POST → Resend
components/
  layout/Header.tsx       # Async server component — fetches site settings
  layout/Footer.tsx       # Async server component — fetches site settings
  home/HeroSection.tsx    # Full-bleed hero with react-datocms Image
  portfolio/
    GalleryGrid.tsx       # Responsive grid wrapper
    PortfolioCard.tsx     # Card with react-datocms Image
  contact/ContactForm.tsx # "use client" form
lib/
  datocms.ts              # DatoCMS client + performQuery + getSiteSettings
  types.ts                # All TypeScript interfaces
```

## Environment Variables

| Variable | Source |
|---|---|
| `DATOCMS_API_TOKEN` | DatoCMS → Settings → API Tokens → read-only token |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | Verified sender on a domain verified in Resend |
| `RESEND_TO_EMAIL` | Destination for contact form submissions |

Copy `.env.local.example` to `.env.local` to get started.

## Design System

Dark luxury aesthetic — engraving/jewelry feel.

- **Background:** `zinc-950` (#09090b)
- **Card surfaces:** `zinc-900`
- **Borders:** `zinc-800`
- **Primary text:** `stone-100`
- **Muted text:** `stone-400` / `stone-500`
- **Accent:** `gold-500` (#C9A84C) with `gold-400` hover
- **Headings:** `font-serif` (Cormorant Garamond), light weight, wide tracking
- **Labels/nav:** tiny uppercase with `tracking-[0.25em]`

## Development

```bash
npm run dev     # http://localhost:3000
npx tsc --noEmit  # type check
npm run build   # production build
```

## Known Gotchas

- `react-datocms` v8 has a `VideoPlayer` component that imports `@mux/mux-player-react/lazy`. It's stubbed out in `next.config.js` — do not remove that alias.
- The `site_setting` model is a DatoCMS **singleton**. DatoCMS enforces singular names for singletons, so it's `site_setting` not `site_settings`, which maps to GraphQL field `siteSetting`.
- Portfolio pieces must be **published** in DatoCMS (not just saved) to appear via the read-only CDA token.
- `@datocms/cda-client` installed at v0.x — the API is `executeQuery(query, { token })`, not the `buildClient` pattern you may find in older DatoCMS docs.
