// Case studies shown on service pages and at /case-studies/<slug>/.
//
// Rules for this file (the repo is public):
// - Only facts Jason has confirmed. No invented metrics, numbers, or quotes.
// - A client is named only with permission. Otherwise describe the client
//   generically (for example "a travel-industry company").
// - Fields marked PLACEHOLDER COPY need Jason's facts before launch.

export interface CaseStudy {
  slug: string;
  title: string;
  /** Who the work was for, as it may be shown publicly. */
  client: string;
  /** One or two lines for cards and the meta description. */
  summary: string;
  problem: string;
  /** What we built. */
  work: string[];
  stack: string[];
  result: string;
  /** Service slugs this case study supports. */
  services: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'travel-data-platform',
    title: 'A greenfield cloud analytics platform',
    client: 'A travel-industry company (contract engagement)',
    summary:
      'Sole data engineer on a greenfield cloud analytics platform: change data capture into Snowflake, a medallion warehouse, and governed access to sensitive data.',
    // PLACEHOLDER COPY: the "before" state is not confirmed yet.
    problem:
      'The company needed its operational data in a cloud warehouse that analysts could use directly, with sensitive data protected from the start.',
    work: [
      'A change data capture pipeline from RDS MySQL through AWS DMS (full load plus ongoing CDC) to Parquet files in S3, loaded into Snowflake through EventBridge and SQS',
      'A bronze, silver, and gold medallion design using Snowpipe, streams, tasks, and stored procedures',
      'A gold-layer star schema with Type 2 slowly changing dimensions',
      'PII masking, row-level security, and role-based access control',
      'Infrastructure in Terraform and schema changes managed with SchemaChange',
    ],
    stack: ['AWS RDS (MySQL)', 'AWS DMS', 'Amazon S3 (Parquet)', 'Amazon EventBridge', 'Amazon SQS', 'Snowflake', 'Terraform', 'SchemaChange'],
    // PLACEHOLDER COPY: no confirmed outcome or metric yet.
    result:
      'One governed warehouse for reporting, built as the only data engineer on the project. Outcome details to be confirmed.',
    services: ['data-engineering', 'infra-devops', 'fractional-data-engineer'],
  },
  {
    slug: 'math-with-henry',
    title: 'Math with Henry',
    client: 'Math with Henry, a private virtual math tutoring business',
    summary:
      'A fast single-page website for a virtual math tutoring business, with a small backend so the owner can edit content himself.',
    // PLACEHOLDER COPY: problem and result need Jason's facts. Stack and build
    // facts come from the project's ProjectOS note and public repo.
    problem: 'A tutoring business needed a simple, fast website the owner could keep up to date without a developer.',
    work: [
      'A static single-page site in plain HTML, CSS, and JavaScript, with no build step',
      'A small serverless backend for the content the owner edits',
      'Hosting and deploys on Netlify',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Netlify Functions', 'Netlify'],
    result: 'A live site the owner can update himself. Outcome details to be confirmed.',
    services: ['websites'],
  },
  {
    slug: 'dci-payroll',
    title: 'DCI Payroll',
    client: 'Internal tool, built for DeCorte Industries',
    summary:
      'An internal payroll calculator that produces the journal entries for our own bookkeeping, so payroll and the books stay in step.',
    // PLACEHOLDER COPY: problem and result need Jason's facts. Stack facts
    // come from the project's ProjectOS note.
    problem: 'Running payroll and then re-entering it in the books by hand was slow and easy to get wrong.',
    work: [
      'A payroll calculator that generates bookkeeping journal entries',
      'A Python web app with a database and schema migrations',
      'Packaged in Docker so it runs on our own hardware',
    ],
    stack: ['Python', 'FastAPI', 'SQLModel', 'Docker', 'pytest'],
    result: 'Payroll runs and the matching journal entries come from one tool. Outcome details to be confirmed.',
    services: ['python-backend', 'ai-cleanup'],
  },
  {
    slug: 'ampersight',
    title: 'Ampersight',
    client: 'Personal project',
    summary:
      'A self-hosted electricity dashboard that reads utility statements, compares usage with the prior year, and adds the weather for each billing period.',
    // PLACEHOLDER COPY: problem and result need Jason's facts. Stack facts
    // come from the project's ProjectOS note and public repo.
    problem: 'Utility statements arrive as PDFs, which makes it hard to see how usage changes from year to year and why.',
    work: [
      'Imports utility PDF statements and compares usage with the prior year',
      'Shows cached weather for each billing period, plus household context',
      'CI runs the tests and publishes multi-architecture container images that a home NAS pulls',
    ],
    stack: ['Python', 'PostgreSQL', 'Docker', 'GitHub Actions', 'GitHub Container Registry'],
    result: 'A dashboard that runs at home and updates through published images. Outcome details to be confirmed.',
    services: ['infra-devops'],
  },
];

export function caseStudiesBySlug(slugs: string[]): CaseStudy[] {
  return slugs.map((slug) => caseStudies.find((study) => study.slug === slug)).filter((study): study is CaseStudy => !!study);
}
