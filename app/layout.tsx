import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/datocms';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.siteTitle ?? 'Engraving Artist';
  const tagline = settings?.tagline;

  return {
    title: {
      template: `%s — ${name}`,
      default: name,
    },
    description: tagline ?? 'Portfolio of engraving work',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans flex min-h-screen flex-col bg-zinc-950 text-stone-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
