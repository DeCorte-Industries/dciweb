export type ServiceIconName = 'database' | 'code' | 'server' | 'percent';

// The four service accents are the same tier colors used in the hero's
// medallion diagram, plus "signal" (the interactive blue) — reused
// deliberately rather than picked at random per card.
export type ServiceColor = 'signal' | 'bronze' | 'silver' | 'gold';

export interface ServiceDetail {
  intro: string;
  bullets: string[];
  idealFor: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  /** Short teaser shown on the homepage card. */
  summary: string;
  /** Expanded content shown on the Services page. */
  detail: ServiceDetail;
  icon: ServiceIconName;
  color: ServiceColor;
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
  },
];
