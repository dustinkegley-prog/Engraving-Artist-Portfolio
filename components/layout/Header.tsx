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
