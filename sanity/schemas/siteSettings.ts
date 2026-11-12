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
    defineField({
      name: 'location',
      title: 'Location Line',
      type: 'string',
      description: 'Shown in the footer and on About, e.g. "Georgia-based, remote across the US".',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Shown in the footer and on About. Leave empty to use the site defaults.',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    }),
  ],
});
