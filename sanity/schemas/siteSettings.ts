import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — restrict creation to one document via Studio structure (see sanity/deskStructure if added).
  fields: [
    defineField({ name: 'companyName', title: 'Company Name', type: 'string', initialValue: 'DeCorte Industries' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
  ],
});
