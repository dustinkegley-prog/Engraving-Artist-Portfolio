// lib/types.ts

export interface DatoCmsResponsiveImage {
  src: string;
  width: number;
  height: number;
  alt: string | null;
  title: string | null;
  base64: string | null;
  bgColor: string | null;
  sizes: string;
  srcSet: string;
  webpSrcSet: string;
}

export interface PortfolioPiece {
  id: string;
  title: string;
  slug: string;
  coverImage: {
    responsiveImage: DatoCmsResponsiveImage;
  };
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  featured: boolean;
  displayOrder: number | null;
  description: unknown | null; // StructuredText document — typed by react-datocms at render time
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string | null;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  heroImage: {
    responsiveImage: DatoCmsResponsiveImage;
  } | null;
  aboutText: unknown | null; // StructuredText document
  aboutPhoto: {
    responsiveImage: DatoCmsResponsiveImage;
  } | null;
  instagramUrl: string | null;
}
