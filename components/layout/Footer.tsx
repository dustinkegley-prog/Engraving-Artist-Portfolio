// components/layout/Footer.tsx
import Link from 'next/link';
import { getSiteSettings } from '@/lib/datocms';

export default async function Footer() {
  const settings = await getSiteSettings();
  const name = settings?.siteTitle ?? 'Artist Name';
  const instagram = settings?.instagramUrl;

  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-px w-12 bg-gold-500 opacity-60" />
          <p className="text-[11px] tracking-[0.25em] uppercase text-stone-500">
            © {new Date().getFullYear()} {name}
          </p>
          {instagram && (
            <Link
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.2em] uppercase text-stone-600 hover:text-gold-500 transition-colors duration-300"
            >
              Instagram
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
