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
      name: 'audience',
      title: 'Audience',
      description: 'Which section of /services this service sits in.',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Engineering teams', value: 'engineering' },
          { title: 'Small businesses', value: 'small-business' },
        ],
      },
      initialValue: 'engineering',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Short teaser shown on the /services index card.',
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
          { title: 'Ledger', value: 'ledger' },
          { title: 'Workflow', value: 'workflow' },
          { title: 'Globe', value: 'globe' },
          { title: 'Search', value: 'search' },
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
      title: 'Offer',
      description: 'The offer shown on this service\'s own page (/services/<slug>/).',
      type: 'object',
      fields: [
        defineField({
          name: 'intro',
          title: 'Intro',
          description: 'Opening paragraph for the offer.',
          type: 'text',
          rows: 4,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'bullets',
          title: 'What You Get',
          description: 'Bulleted list of deliverables or capabilities.',
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
    defineField({
      name: 'problem',
      title: 'Problem',
      description: 'The problem this service solves, shown at the top of its page.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'steps',
      title: 'How It Works',
      description: 'Three short steps.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'detail', title: 'Detail', type: 'text', rows: 2, validation: (r) => r.required() }),
          ],
        },
      ],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Call-to-Action Label',
      description: 'Button text. The button books the free 15-minute intro call.',
      type: 'string',
    }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'audience' },
  },
});
