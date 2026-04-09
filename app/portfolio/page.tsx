// app/portfolio/page.tsx
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import { performQuery } from '@/lib/datocms';
import type { PortfolioPiece } from '@/lib/types';

const PORTFOLIO_QUERY = `
  query PortfolioQuery {
    allPortfolioPieces(orderBy: _createdAt_DESC) {
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
  title: 'Portfolio',
};

export default async function PortfolioPage() {
  let pieces: PortfolioQueryResult['allPortfolioPieces'] = [];

  if (process.env.DATOCMS_API_TOKEN) {
    const data = await performQuery<PortfolioQueryResult>(PORTFOLIO_QUERY);
    pieces = data.allPortfolioPieces;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-16 text-center">
        <div className="mx-auto mb-6 h-px w-12 bg-gold-500 opacity-60" />
        <h1 className="font-serif text-5xl font-light tracking-[0.15em] text-stone-100">
          Portfolio
        </h1>
        <div className="mx-auto mt-6 h-px w-12 bg-gold-500 opacity-60" />
      </div>
      <GalleryGrid pieces={pieces} />
    </div>
  );
}
