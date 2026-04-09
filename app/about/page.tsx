// app/about/page.tsx
// IMPORTANT: Uses react-datocms Image — NOT next/image
import { Image as DatoCmsImage, StructuredText } from 'react-datocms';
import { performQuery } from '@/lib/datocms';
import type { SiteSettings } from '@/lib/types';

const ABOUT_QUERY = `
  query AboutQuery {
    siteSetting {
      aboutText { value }
      aboutPhoto {
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
    }
  }
`;

interface AboutQueryResult {
  siteSetting: Pick<SiteSettings, 'aboutText' | 'aboutPhoto'> | null;
}

export const metadata = {
  title: 'About',
};

export default async function AboutPage() {
  let settings: AboutQueryResult['siteSetting'] = null;

  if (process.env.DATOCMS_API_TOKEN) {
    const data = await performQuery<AboutQueryResult>(ABOUT_QUERY);
    settings = data.siteSetting;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
      <div className="mb-16 text-center">
        <div className="mx-auto mb-6 h-px w-12 bg-gold-500 opacity-60" />
        <h1 className="font-serif text-5xl font-light tracking-[0.15em] text-stone-100">
          About
        </h1>
        <div className="mx-auto mt-6 h-px w-12 bg-gold-500 opacity-60" />
      </div>

      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {settings?.aboutPhoto ? (
          <div className="w-full max-w-sm mx-auto flex-shrink-0 md:max-w-none md:mx-0 md:w-72">
            <DatoCmsImage
              data={settings.aboutPhoto.responsiveImage}
              className="w-full border border-zinc-800"
              pictureClassName="w-full"
            />
          </div>
        ) : (
          <div className="h-80 w-full max-w-sm mx-auto flex-shrink-0 md:max-w-none md:mx-0 md:w-72 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="text-[11px] tracking-widest uppercase text-zinc-600">[PLACEHOLDER] Photo</span>
          </div>
        )}

        <div className="flex-1 text-stone-300 leading-relaxed space-y-4">
          {settings?.aboutText ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <StructuredText data={settings.aboutText as any} />
          ) : (
            <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-600">
              [PLACEHOLDER] About text will appear here once configured in DatoCMS.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
