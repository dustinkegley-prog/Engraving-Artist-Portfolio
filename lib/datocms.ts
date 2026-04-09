// lib/datocms.ts
// Uses @datocms/cda-client v0.x: executeQuery(query, { token, variables })
import { executeQuery } from '@datocms/cda-client';
import type { SiteSettings } from './types';

if (!process.env.DATOCMS_API_TOKEN) {
  console.warn('DATOCMS_API_TOKEN is not set — CMS queries will fail');
}

export async function performQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return executeQuery<T>(query, {
    token: process.env.DATOCMS_API_TOKEN ?? '',
    // Bypass Next.js data cache so content changes in DatoCMS appear immediately.
    // Switch to { next: { revalidate: 60 } } after launch for ISR.
    fetchFn: (url, init) => fetch(url, { ...init as RequestInit, cache: 'no-store' }),
    ...(variables ? { variables } : {}),
  });
}

const SITE_SETTINGS_QUERY = `
  query SiteSettingsQuery {
    siteSetting {
      siteTitle
      tagline
      instagramUrl
    }
  }
`;

type SiteSettingsResult = Pick<SiteSettings, 'siteTitle' | 'tagline' | 'instagramUrl'> | null;

export async function getSiteSettings(): Promise<SiteSettingsResult> {
  if (!process.env.DATOCMS_API_TOKEN) return null;
  const data = await performQuery<{ siteSetting: SiteSettingsResult }>(SITE_SETTINGS_QUERY);
  return data.siteSetting;
}
