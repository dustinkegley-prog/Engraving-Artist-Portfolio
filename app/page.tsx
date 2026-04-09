// app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import { performQuery } from '@/lib/datocms';
import type { SiteSettings, PortfolioPiece } from '@/lib/types';

const HOME_QUERY = `
  query HomeQuery {
    siteSetting {
      heroHeadline
      heroSubheadline
      heroImage {
        responsiveImage(imgixParams: { w: 3200, fit: crop, auto: format }) {
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
    allPortfolioPieces(filter: { featured: { eq: true } }, orderBy: _createdAt_DESC) {
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

interface HomeQueryResult {
  siteSetting: Pick<SiteSettings, 'heroHeadline' | 'heroSubheadline' | 'heroImage'> | null;
  allPortfolioPieces: Pick<PortfolioPiece, 'id' | 'title' | 'slug' | 'coverImage' | 'medium' | 'year'>[];
}

export default async function HomePage() {
  let data: HomeQueryResult | null = null;

  if (process.env.DATOCMS_API_TOKEN) {
    data = await performQuery<HomeQueryResult>(HOME_QUERY);
  }

  const settings = data?.siteSetting ?? null;
  const featured = data?.allPortfolioPieces ?? [];

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline ?? null}
        subheadline={settings?.heroSubheadline ?? null}
        image={settings?.heroImage ?? null}
      />

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-center gap-6 mb-14">
            <div className="h-px flex-1 bg-zinc-800" />
            <h2 className="font-serif text-3xl font-light tracking-[0.15em] text-stone-100">
              Featured Work
            </h2>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 bg-zinc-800">
            {featured.map((piece) => (
              <PortfolioCard
                key={piece.id}
                title={piece.title}
                slug={piece.slug}
                coverImage={piece.coverImage}
                medium={piece.medium}
                year={piece.year}
              />
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-zinc-600">
            Mark portfolio pieces as &quot;featured&quot; in DatoCMS to show them here.
          </p>
        </section>
      )}
    </>
  );
}
