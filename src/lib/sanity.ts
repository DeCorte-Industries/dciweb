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

export interface ServiceDetail {
  intro: string;
  bullets: string[];
  idealFor: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  icon: 'database' | 'code' | 'server' | 'percent';
  color: 'signal' | 'bronze' | 'silver' | 'gold';
  detail: ServiceDetail;
  order: number;
}

export interface PostAuthor {
  name: string;
  role: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  coverImage?: any;
  author?: PostAuthor | null;
  publishedAt?: string;
  tags?: string[];
  body?: any[];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getServices(): Promise<Service[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(`*[_type == "service"] | order(order asc)`);
}

// Posts are ordered newest-first by publishedAt; a post with no publishedAt
// set yet (e.g. still being drafted) sorts to the end rather than crashing
// the query.
export async function getPosts(): Promise<Post[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, "1970-01-01") desc) {
      _id, title, slug, summary, coverImage, publishedAt, tags,
      "author": author->{ name, role }
    }`,
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, summary, coverImage, publishedAt, tags, body,
      "author": author->{ name, role }
    }`,
    { slug },
  );
}
