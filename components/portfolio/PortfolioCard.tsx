// components/portfolio/PortfolioCard.tsx
// IMPORTANT: Uses react-datocms Image — NOT next/image
import Link from 'next/link';
import { Image as DatoCmsImage } from 'react-datocms';
import type { PortfolioPiece } from '@/lib/types';

type PortfolioCardProps = Pick<
  PortfolioPiece,
  'title' | 'slug' | 'coverImage' | 'medium' | 'year'
>;

export default function PortfolioCard({ title, slug, coverImage, medium, year }: PortfolioCardProps) {
  return (
    <Link href={`/portfolio/${slug}`} className="group block">
      <article className="overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 transition-colors duration-500">
        <div className="aspect-square overflow-hidden">
          {coverImage?.responsiveImage ? (
            <DatoCmsImage
              data={coverImage.responsiveImage}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              pictureClassName="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-xs tracking-widest uppercase text-zinc-600">
              No image
            </div>
          )}
        </div>
        <div className="px-4 py-4 border-t border-zinc-800 group-hover:border-gold-500/30 transition-colors duration-500">
          <h3 className="font-serif text-base font-light tracking-wide text-stone-100 truncate">
            {title}
          </h3>
          {(medium || year) && (
            <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-gold-500/70">
              {[medium, year].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
