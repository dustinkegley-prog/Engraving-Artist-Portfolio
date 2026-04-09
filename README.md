# [PLACEHOLDER] Artist Name — Portfolio Site

Next.js 14 portfolio for an engraving artist. Built with DatoCMS (content), Resend (contact form), and Tailwind CSS.

## Local dev setup

### Prerequisites

- Node.js 18+
- A DatoCMS account and project
- A Resend account with a verified sender domain

### 1. Clone and install

```bash
git clone <repo-url>
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

The app boots without these values — pages show `[PLACEHOLDER]` fallbacks instead of CMS content.

### 3. Configure DatoCMS content models

Create these two models in the DatoCMS UI (Settings → Models):

**`portfolio_piece`** (repeating content)

| Field | Type | Required |
|---|---|---|
| `title` | Single-line string | Yes |
| `slug` | Slug | Yes |
| `cover_image` | Single asset (image) | Yes |
| `gallery_images` | Gallery | No |
| `description` | Structured text | No |
| `medium` | Single-line string | No |
| `dimensions` | Single-line string | No |
| `year` | Integer | No |
| `featured` | Boolean | No |
| `display_order` | Integer | No |

**`site_settings`** (singleton)

| Field | Type | Required |
|---|---|---|
| `site_title` | Single-line string | Yes |
| `tagline` | Single-line string | No |
| `hero_headline` | Single-line string | No |
| `hero_subheadline` | Single-line string | No |
| `hero_image` | Single asset (image) | No |
| `about_text` | Structured text | No |
| `about_photo` | Single asset (image) | No |
| `instagram_url` | Single-line string | No |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Warning: DatoCMS image rule

**Never use `next/image` to render DatoCMS images.** Always use the `<Image>` component from `react-datocms`:

```tsx
// Correct
import { Image as DatoCmsImage } from 'react-datocms';
<DatoCmsImage data={piece.coverImage.responsiveImage} />

// Wrong — routes bandwidth through Vercel, incurs costs at scale
import Image from 'next/image';
<Image src={piece.coverImage.url} ... />
```

DatoCMS serves images through its own CDN via `responsiveImage`. Using `next/image` forces them through Vercel's image optimization pipeline, generating significant bandwidth charges.

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in the [Vercel dashboard](https://vercel.com/new)
3. Add all keys from `.env.local.example` as Vercel environment variables
4. Deploy
