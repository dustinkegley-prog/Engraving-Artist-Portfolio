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
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {image ? (
        <div className="absolute inset-0 overflow-hidden">
          <DatoCmsImage
            data={image.responsiveImage}
            className="!block !w-full !h-full !max-w-none"
            pictureClassName="!absolute !inset-0 !w-full !h-full"
            imgClassName="!w-full !h-full !object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center" style={{ minHeight: '100vh' }}>
        {/* Gold rule above */}
        <div className="mb-8 h-px w-16 bg-gold-500 opacity-80" />

        <h1 className="font-serif text-5xl font-light tracking-[0.1em] text-stone-100 sm:text-7xl">
          {headline ?? '[PLACEHOLDER] Headline'}
        </h1>

        {subheadline && (
          <p className="mt-6 text-sm tracking-[0.3em] uppercase text-stone-400 max-w-md">
            {subheadline}
          </p>
        )}

        {/* Gold rule below */}
        <div className="mt-8 h-px w-16 bg-gold-500 opacity-80" />
      </div>
    </section>
  );
}
