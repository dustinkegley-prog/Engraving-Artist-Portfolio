// components/portfolio/GalleryGrid.tsx
import PortfolioCard from './PortfolioCard';
import type { PortfolioPiece } from '@/lib/types';

interface GalleryGridProps {
  pieces: Pick<PortfolioPiece, 'id' | 'title' | 'slug' | 'coverImage' | 'medium' | 'year'>[];
}

export default function GalleryGrid({ pieces }: GalleryGridProps) {
  if (pieces.length === 0) {
    return (
      <p className="py-24 text-center text-[11px] tracking-[0.25em] uppercase text-zinc-600">
        No pieces published yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 bg-zinc-800">
      {pieces.map((piece) => (
        <PortfolioCard key={piece.id} {...piece} />
      ))}
    </div>
  );
}
