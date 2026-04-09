// app/portfolio/[slug]/page.tsx
// IMPORTANT: Uses react-datocms Image — NOT next/image
import { notFound } from 'next/navigation';
import { Image as DatoCmsImage } from 'react-datocms';
import { performQuery } from '@/lib/datocms';
import type { PortfolioPiece } from '@/lib/types';

const PIECE_QUERY = `
  query PieceQuery($slug: String!) {
    portfolioPiece(filter: { slug: { eq: $slug } }) {
      id
      title
      slug
      medium
      dimensions
      year
      coverImage {
        responsiveImage(imgixParams: { w: 1200, auto: format }) {
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
    }
  }
`;

interface PieceQueryResult {
  portfolioPiece: Pick<
    PortfolioPiece,
    'id' | 'title' | 'slug' | 'medium' | 'dimensions' | 'year' | 'coverImage'
  > | null;
}

interface Props {
  params: { slug: string };
}

export default async function PortfolioPiecePage({ params }: Props) {
  let piece: PieceQueryResult['portfolioPiece'] = null;

  if (process.env.DATOCMS_API_TOKEN) {
    const data = await performQuery<PieceQueryResult>(PIECE_QUERY, { slug: params.slug });
    piece = data.portfolioPiece;
  }

  if (!piece) notFound();

  const meta = [piece.medium, piece.dimensions, piece.year].filter(Boolean).join(' · ');

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Image */}
        <div className="overflow-hidden bg-zinc-900 border border-zinc-800">
          {piece.coverImage?.responsiveImage ? (
            <DatoCmsImage data={piece.coverImage.responsiveImage} />
          ) : (
            <div className="aspect-square flex items-center justify-center bg-zinc-900 text-xs tracking-widest uppercase text-zinc-600">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:pt-4">
          <div className="mb-6 h-px w-10 bg-gold-500 opacity-60" />
          <h1 className="font-serif text-4xl font-light tracking-[0.1em] text-stone-100">
            {piece.title}
          </h1>
          {meta && (
            <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-gold-500/80">
              {meta}
            </p>
          )}
          <div className="mt-10 h-px w-10 bg-gold-500 opacity-60" />
        </div>
      </div>
    </div>
  );
}
