import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;

// Sanity isn't configured until a project ID is set (see .env.example).
// Until then, sanityClient stays null and the getX() helpers below fall
// back to empty results so pages can render placeholder content instead
// of crashing the build.
export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
      useCdn: true,
    })
  : null;

export function urlFor(source: any) {
  if (!sanityClient) return null;
  return imageUrlBuilder(sanityClient).image(source);
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  description: string;
  order: number;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getServices(): Promise<Service[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(`*[_type == "service"] | order(order asc)`);
}
