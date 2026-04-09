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
