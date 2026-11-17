import { getServices } from './sanity';

export type ServiceIconName =
  | 'database'
  | 'code'
  | 'server'
  | 'percent'
  | 'ledger'
  | 'workflow'
  | 'globe'
  | 'search';

/** Which of the two doors a service sits behind on /services. */
export type ServiceAudience = 'engineering' | 'small-business';

export const audienceLabels: Record<ServiceAudience, { eyebrow: string; title: string }> = {
  engineering: { eyebrow: 'for engineering teams', title: 'Engineering' },
  'small-business': { eyebrow: 'for small businesses', title: 'Small Business' },
};

// The four service accents are the same tier colors used in the hero's
// medallion diagram, plus "signal" (the interactive blue) — reused
// deliberately rather than picked at random per card.
export type ServiceColor = 'signal' | 'bronze' | 'silver' | 'gold';

export interface ServiceDetail {
  intro: string;
  bullets: string[];
  idealFor: string;
}

export interface ServiceStep {
  title: string;
  detail: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceItem {
  /** URL slug: the page lives at /services/<id>/. */
  id: string;
  title: string;
  audience: ServiceAudience;
  /** Short teaser shown on the /services index card. */
  summary: string;
  /** Offer: intro, deliverables, and who it fits. */
  detail: ServiceDetail;
  icon: ServiceIconName;
  color: ServiceColor;
  /** Service page: the problem this service solves. */
  problem: string;
  /** Service page: how it works, in three steps. */
  steps: ServiceStep[];
  faqs: ServiceFaq[];
  /** One call to action per page. The intake form is batch 3, so every CTA books the intro call for now. */
  ctaLabel: string;
  /** Slugs from lib/caseStudies shown as proof on the service page. */
  caseStudies: string[];
  /** Shows the bookkeeping disclaimer next to the offer. */
  bookkeeping?: boolean;
}

// Full literal class strings (not built with template interpolation) so
// Tailwind's static scanner picks them up from this file.
export const tierTextClass: Record<ServiceColor, string> = {
  signal: 'text-signal',
  bronze: 'text-bronze',
  silver: 'text-silver',
  gold: 'text-gold',
};

export const tierBgClass: Record<ServiceColor, string> = {
  signal: 'bg-signal',
  bronze: 'bg-bronze',
  silver: 'bg-silver',
  gold: 'bg-gold',
};

export const fallbackServices: ServiceItem[] = [
  {
    id: 'data-engineering',
    title: 'Data Engineering & Cloud Platforms',
    summary:
      'Snowflake architecture, CDC pipelines, dimensional modeling, and ETL/ELT on AWS — from greenfield builds to platforms processing 200M+ records a year.',
    detail: {
      intro:
        'We design and build the data platforms underneath your reporting, analytics, and ML work — the pipelines, warehouses, and models that turn raw operational data into something your team can actually trust.',
      bullets: [
        'Snowflake architecture: Snowpipe, streams, tasks, stored procedures, and bronze/silver/gold medallion design',
        'Change data capture (CDC) pipelines from operational databases into your warehouse (e.g. AWS DMS)',
        'Dimensional modeling: star schemas, Type 2 slowly changing dimensions, and fact/dimension design',
        'Large-scale ETL/ELT with AWS Glue, PySpark, and Apache Airflow',
        'PII governance, row-level security, and RBAC for compliance-sensitive data',
      ],
      idealFor:
        'Teams migrating off a legacy warehouse, building their first real data platform, or scaling past what ad hoc spreadsheets and scripts can handle.',
    },
    icon: 'database',
    color: 'gold',
    audience: 'engineering',
    // INVENTED COPY: review (problem, steps, FAQ, CTA label)
    problem:
      'Reporting runs on exports nobody trusts, the warehouse migration has stalled, or every new question means another one-off script.',
    steps: [
      { title: 'Assess', detail: 'We review your sources, warehouse, and reporting needs, and write up what to fix first.' },
      { title: 'Build', detail: 'We build the pipelines, models, and access rules in small, reviewed pieces you can see working.' },
      { title: 'Hand off', detail: 'You get documentation and a walkthrough, so your team can run and extend the platform.' },
    ],
    faqs: [
      {
        question: 'Do you work with our existing warehouse?',
        answer: 'Yes. We start from what you already run and change only what the assessment shows needs changing.',
      },
      {
        question: 'Can you work alongside our engineers?',
        answer: 'Yes. We work in your repositories and review process, and we document as we go.',
      },
    ],
    ctaLabel: 'Book a data platform intro call',
    caseStudies: ['travel-data-platform'],
  },
  {
    id: 'python-backend',
    title: 'Python Backend Engineering',
    summary:
      'FastAPI, Flask, SQLAlchemy, and Pydantic services — microservices, REST/GraphQL APIs, and event-driven architecture on AWS.',
    detail: {
      intro:
        'We build and maintain production backend services in Python — the APIs and internal tools your product runs on — designed to scale and stay maintainable long after we hand them off.',
      bullets: [
        'REST and GraphQL APIs built with FastAPI and Flask',
        'Data modeling and validation with SQLAlchemy and Pydantic',
        'Event-driven architectures using AWS EventBridge, SQS, and Lambda',
        'Migrating legacy services onto modern, containerized infrastructure',
        'Technical leadership, code review, and mentoring for existing engineering teams',
      ],
      idealFor:
        'Teams that need a senior Python engineer to ship a service, unblock a migration, or raise the bar on an existing codebase.',
    },
    icon: 'code',
    color: 'signal',
    audience: 'engineering',
    // INVENTED COPY: review (problem, steps, FAQ, CTA label)
    problem:
      'A service needs to ship, a legacy API needs to move, or a codebase has grown past what the team can safely change.',
    steps: [
      { title: 'Scope', detail: 'We agree on what the service has to do and how it will be tested and deployed.' },
      { title: 'Build', detail: 'We ship it in small pull requests with tests, in your repository and your review process.' },
      { title: 'Hand off', detail: 'Documentation and a walkthrough, so your team owns it from day one.' },
    ],
    faqs: [
      {
        question: 'Which frameworks do you use?',
        answer: 'Mostly FastAPI and Flask, with SQLAlchemy or SQLModel and Pydantic, on AWS. We follow your stack when you have one.',
      },
    ],
    ctaLabel: 'Book a scoping intro call',
    caseStudies: ['dci-payroll'],
  },
  {
    id: 'infra-devops',
    title: 'Infrastructure & DevOps',
    summary:
      'Terraform and AWS CDK infrastructure-as-code, Docker/Kubernetes, CI/CD, and PII governance / row-level security.',
    detail: {
      intro:
        'We treat infrastructure as a product: version-controlled, repeatable, and secure by default, so deploys are routine instead of stressful.',
      bullets: [
        'Infrastructure-as-code with Terraform and AWS CDK (Python)',
        'Containerization with Docker and orchestration with Kubernetes, ECS, or EKS',
        'CI/CD pipelines with GitHub Actions',
        'Security and compliance: PII masking, row-level security, RBAC',
        'Cost and performance audits of existing AWS environments',
      ],
      idealFor:
        'Teams whose deployment process is still manual, undocumented, or held together as one person’s tribal knowledge.',
    },
    icon: 'server',
    color: 'silver',
    audience: 'engineering',
    // INVENTED COPY: review (problem, steps, FAQ, CTA label)
    problem:
      'Deploys are manual, the AWS bill surprises you, or only one person knows how production is set up.',
    steps: [
      { title: 'Review', detail: 'We look at how you deploy today and where the cost and security risks are.' },
      { title: 'Codify', detail: 'We move the setup into version-controlled infrastructure as code and automated pipelines.' },
      { title: 'Hand off', detail: 'Runbooks and a walkthrough, so deploys stay routine after we leave.' },
    ],
    faqs: [
      {
        question: 'Terraform or CDK?',
        answer: 'Either. We use what your team already knows, or recommend one and explain why.',
      },
    ],
    ctaLabel: 'Book an AWS intro call',
    caseStudies: ['ampersight', 'travel-data-platform'],
  },
  {
    id: 'fractional-data-engineer',
    title: 'Fractional Data Engineer',
    summary:
      'A senior data engineer on a part-time retainer — full-time expertise at a fraction of full-time cost, sized to how much data engineering work you actually have.',
    detail: {
      intro:
        'Most companies don’t have enough data engineering work to justify a full-time hire — but they have more than they can safely ignore. Fractional engagement is a staffing model, common among fractional CTOs and data teams, where a senior engineer splits a fixed amount of time across several clients (for example, one engineer at roughly 20% capacity across five clients) instead of working full-time for one. You get a dedicated weekly or monthly allocation rather than a one-off contractor, so the same person who architected your pipeline is still the one maintaining it six months later.',
      bullets: [
        'A fixed weekly or monthly time allocation (e.g. one day a week) that flexes up temporarily for major projects like a warehouse migration',
        'Ongoing pipeline maintenance, monitoring, and incident response without carrying a full-time headcount',
        'Immediate access to senior-level expertise, with no lengthy hiring process',
        'Continuity — the engineer who built your platform keeps evolving it, rather than handing off to whoever’s free',
        'Knowledge transfer to your existing team, so in-house capability grows instead of creating a permanent dependency',
      ],
      idealFor:
        'Startups and mid-size teams with real data infrastructure but not enough day-to-day volume to justify — or budget for — a full-time data engineer.',
    },
    icon: 'percent',
    color: 'bronze',
    audience: 'engineering',
    // INVENTED COPY: review (problem, steps, FAQ, CTA label)
    problem:
      'You have real data infrastructure to run, but not enough work to justify a full-time senior data engineer.',
    steps: [
      { title: 'Size it', detail: 'We agree on a regular time allocation that matches the work you actually have.' },
      { title: 'Run it', detail: 'The same senior engineer maintains, monitors, and improves your platform week to week.' },
      { title: 'Grow your team', detail: 'Knowledge transfer as we go, so in-house capability grows instead of a dependency.' },
    ],
    faqs: [
      {
        question: 'Can the allocation change?',
        answer: 'Yes. It can flex up for a big project, such as a warehouse migration, and back down afterward.',
      },
    ],
    ctaLabel: 'Book a fractional intro call',
    caseStudies: ['travel-data-platform'],
  },
  // Small Business services. The offer outlines follow the redesign review;
  // amounts are never shown on the site (Jason, 2026-11-17).
  {
    // INVENTED COPY: review (all text in this entry)
    id: 'ai-cleanup',
    title: 'Fixed-price AI cleanup',
    audience: 'small-business',
    summary:
      'Books and payroll data cleanup at a fixed quote agreed before we start. AI does the bulk sorting; a person with 25+ years of small-business books reviews it.',
    detail: {
      intro:
        'Months of uncategorized transactions or messy payroll exports, cleaned up without an hourly meter. AI handles the repetitive sorting, and every result is reviewed by someone who has kept small-business books and run payroll for 25+ years.',
      bullets: [
        'Categorized and reconciled transaction data',
        'An exceptions list of anything that needs your decision',
        'Clean import files for your accounting software',
        'A one-page summary of what we changed and why',
      ],
      idealFor:
        'Owners with a backlog of uncategorized transactions, messy payroll exports, or an accountant waiting on clean books.',
    },
    icon: 'ledger',
    color: 'gold',
    problem:
      'The books are months behind, payroll exports do not line up, and catching up by hand would take weeks you do not have.',
    steps: [
      { title: 'Intro call', detail: 'A free 15-minute call to see what you have and whether a cleanup fits.' },
      { title: 'Fixed quote', detail: 'You get a fixed quote and a list of what you will receive before any work starts.' },
      { title: 'Cleanup and review', detail: 'AI does the bulk work, a person reviews it, and you get clean files and an exceptions list.' },
    ],
    faqs: [
      {
        question: 'Is this tax or accounting advice?',
        answer: 'No. This is a bookkeeping data cleanup. For tax, legal, audit, or CPA work, use a licensed professional.',
      },
      {
        question: 'How is the cost set?',
        answer: 'You get a fixed quote after the intro call, based on how much data there is. No hourly billing.',
      },
    ],
    ctaLabel: 'Book a free 15-minute intro call',
    caseStudies: ['dci-payroll'],
    bookkeeping: true,
  },
  {
    // INVENTED COPY: review (all text in this entry)
    id: 'ai-automation-sops',
    title: 'AI Automation & SOPs',
    audience: 'small-business',
    summary:
      'Get the processes out of your head and into written SOPs, then automate the repetitive parts of one workflow at a time.',
    detail: {
      intro:
        'We turn short recorded walkthroughs of how you do things into clear standard operating procedures, then automate the repetitive steps where AI and simple tools can take them over.',
      bullets: [
        'SOPs written from short recorded walkthroughs of your real processes',
        'An automation sprint for one workflow at a time',
        'Plain-language documentation your team can follow and update',
      ],
      idealFor:
        'Owners whose processes live in their heads, or whose week disappears into repetitive manual work.',
    },
    icon: 'workflow',
    color: 'signal',
    problem:
      'Only you know how things get done, so nothing can be handed off, and the same manual steps eat hours every week.',
    steps: [
      { title: 'Record', detail: 'You record short walkthroughs of the processes that matter most.' },
      { title: 'Document', detail: 'We turn them into SOPs your team can follow, and you review them.' },
      { title: 'Automate', detail: 'We pick one workflow and automate the repetitive parts.' },
    ],
    faqs: [
      {
        question: 'Do we need new software?',
        answer: 'Not usually. We start with the tools you already use.',
      },
    ],
    ctaLabel: 'Book a free 15-minute intro call',
    caseStudies: [],
  },
  {
    // INVENTED COPY: review (all text in this entry)
    id: 'websites',
    title: 'Websites',
    audience: 'small-business',
    summary:
      'Fast, low-maintenance websites on a modern static stack. No WordPress and no plugin upkeep.',
    detail: {
      intro:
        'We build small-business websites that load fast, stay secure, and do not need constant plugin updates. This site is built the same way we build yours.',
      bullets: [
        'A fast static site with no WordPress or plugin upkeep',
        'An optional content editor so you can change text yourself',
        'Basic SEO set up from the start: titles, descriptions, and a sitemap',
      ],
      idealFor: 'Small businesses that want a site that works without becoming a maintenance job.',
    },
    icon: 'globe',
    color: 'silver',
    problem:
      'The current site is slow, hard to update, or one plugin update away from breaking.',
    steps: [
      { title: 'Plan', detail: 'We agree on the pages, the content, and what you want visitors to do.' },
      { title: 'Build', detail: 'We build the site and share a preview link you can review before launch.' },
      { title: 'Launch', detail: 'We launch it on your domain and show you how to make updates.' },
    ],
    faqs: [
      {
        question: 'Can I edit the site myself?',
        answer: 'Yes, if you want to. We can add a simple content editor for the parts you change often.',
      },
    ],
    ctaLabel: 'Book a free 15-minute intro call',
    caseStudies: ['math-with-henry'],
  },
  {
    // PLACEHOLDER COPY: the SEO package and its scope are still being written; replace this entry when it is.
    id: 'seo',
    title: 'SEO',
    audience: 'small-business',
    summary: 'Help people find your business in search, as an add-on to a website build or as an ongoing monthly plan.',
    detail: {
      intro:
        'Search visibility for small businesses: the technical basics done right, plus content that answers what your customers search for.',
      bullets: [
        'Technical SEO: titles, descriptions, sitemaps, and structured data',
        'Available as an add-on to a website build',
        'Or as an ongoing monthly plan',
      ],
      idealFor: 'Small businesses whose customers search for them online but cannot find them.',
    },
    icon: 'search',
    color: 'bronze',
    problem: 'Customers are searching for what you offer, but your site does not show up.',
    steps: [
      { title: 'Review', detail: 'We check how your site shows up in search today.' },
      { title: 'Fix', detail: 'We fix the technical basics first.' },
      { title: 'Grow', detail: 'We plan content around what your customers search for.' },
    ],
    faqs: [],
    ctaLabel: 'Book a free 15-minute intro call',
    caseStudies: [],
  },
];

// Fallback data is the base list. A Sanity document whose slug matches a
// fallback service overrides that service's fields; a document with a new
// slug is added. Documents use `slug.current` instead of `id`, and older or
// incomplete documents may be missing fields — normalize both here.
export async function loadServices(): Promise<ServiceItem[]> {
  let cmsServices: Awaited<ReturnType<typeof getServices>> = [];
  try {
    cmsServices = await getServices();
  } catch {
    // Sanity not configured yet.
  }
  const services = fallbackServices.map((service) => ({ ...service }));
  for (const doc of cmsServices as any[]) {
    const id = doc.slug?.current;
    if (!id || !doc.title) continue;
    const base = services.find((service) => service.id === id);
    const merged: ServiceItem = {
      id,
      title: doc.title,
      audience: doc.audience ?? base?.audience ?? 'engineering',
      summary: doc.summary ?? base?.summary ?? '',
      detail: doc.detail
        ? { intro: doc.detail.intro ?? '', bullets: doc.detail.bullets ?? [], idealFor: doc.detail.idealFor ?? '' }
        : (base?.detail ?? { intro: doc.summary ?? '', bullets: [], idealFor: '' }),
      icon: doc.icon ?? base?.icon ?? 'database',
      color: doc.color ?? base?.color ?? 'signal',
      problem: doc.problem ?? base?.problem ?? '',
      steps: doc.steps?.length ? doc.steps : (base?.steps ?? []),
      faqs: doc.faqs?.length ? doc.faqs : (base?.faqs ?? []),
      ctaLabel: doc.ctaLabel ?? base?.ctaLabel ?? 'Book a free 15-minute intro call',
      caseStudies: base?.caseStudies ?? [],
      bookkeeping: base?.bookkeeping,
    };
    if (base) services[services.indexOf(base)] = merged;
    else services.push(merged);
  }
  return services;
}

export function servicesFor(services: ServiceItem[], audience: ServiceAudience) {
  return services.filter((service) => service.audience === audience);
}
