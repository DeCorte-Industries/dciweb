import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Short teaser shown on the homepage service card.',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Which outline icon to show for this service.',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Database', value: 'database' },
          { title: 'Code', value: 'code' },
          { title: 'Server', value: 'server' },
          { title: 'Percent', value: 'percent' },
        ],
      },
      initialValue: 'database',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'color',
      title: 'Accent Color',
      description: 'Reuses the bronze/silver/gold medallion tiers plus signal blue — matches the hero diagram and Services page.',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Signal (blue)', value: 'signal' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Silver', value: 'silver' },
          { title: 'Gold', value: 'gold' },
        ],
      },
      initialValue: 'signal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Services Page Detail',
      description: 'Expanded content shown on the /services page (the homepage card only uses the Summary above).',
      type: 'object',
      fields: [
        defineField({
          name: 'intro',
          title: 'Intro',
          description: 'Opening paragraph for this service on the Services page.',
          type: 'text',
          rows: 4,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'bullets',
          title: 'Capabilities',
          description: 'Bulleted list of specific capabilities.',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'idealFor',
          title: 'Good Fit For',
          description: 'One line describing the ideal client for this service.',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'color' },
  },
});
