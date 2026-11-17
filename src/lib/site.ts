import { getSiteSettings, type SocialLink } from './sanity';

// Public profile links and the location line shown in the footer and on
// About. Sanity's siteSettings can override them; these hardcoded values
// keep the build working when Sanity isn't configured (or the fields are
// still empty in the Studio).
export const fallbackSocialLinks: SocialLink[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wjdecorte/' },
  { label: 'GitHub', url: 'https://github.com/wjdecorte' },
  { label: 'GitHub (DeCorte Industries)', url: 'https://github.com/DeCorte-Industries' },
];

export const fallbackLocation = 'Georgia-based, remote across the US';

export const fallbackContactEmail = 'info@decorteindustries.com';

// INVENTED COPY: review
// Shown next to bookkeeping mentions on home and About, and in the footer.
export const bookkeepingDisclaimer =
  'DeCorte Industries provides bookkeeping and financial-records support, not tax, legal, audit, or CPA services. Clients should consult a licensed professional for those.';

// Default share image (1200x630), used for Open Graph and Twitter cards.
export const defaultOgImage = {
  src: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'DeCorte Industries: data and cloud engineering for teams, fixed-price AI cleanup for small businesses.',
};

// Organization structured data for search engines. sameAs lists only the
// company's own GitHub organization: a LinkedIn profile is not added
// without Jason's ok (SEO review, 2026-11-17).
export function organizationJsonLd(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DeCorte Industries',
    url: new URL('/', siteUrl).href,
    logo: new URL('/logo.png', siteUrl).href,
    description:
      'Data and cloud engineering for teams. Bookkeeping data cleanup, automation, and websites for small businesses.',
    areaServed: 'US',
    sameAs: ['https://github.com/DeCorte-Industries'],
  };
}

export interface SiteConfig {
  companyName: string;
  contactEmail: string;
  location: string;
  socialLinks: SocialLink[];
}

export async function getSiteConfig(): Promise<SiteConfig> {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    // Sanity not configured yet — use the fallbacks below.
  }
  const socialLinks = (settings?.socialLinks ?? []).filter((link) => link?.label && link?.url);
  return {
    companyName: settings?.companyName || 'DeCorte Industries',
    contactEmail: settings?.contactEmail || fallbackContactEmail,
    location: settings?.location || fallbackLocation,
    socialLinks: socialLinks.length ? socialLinks : fallbackSocialLinks,
  };
}
