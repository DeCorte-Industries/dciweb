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
