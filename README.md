# dciweb

DeCorte Industries website. Astro + TypeScript + Tailwind CSS, content optionally managed in Sanity.io, deployed to Vercel or self-hosted via Docker — same stack as the `aauweb` project.

## Local development

```bash
npm install
npm run dev
```

## Content (optional CMS)

Pages fall back to hardcoded placeholder content until Sanity is configured. To enable Sanity:

1. `cd sanity && npx sanity init` (creates your Sanity project)
2. Copy `.env.example` to `.env` in the project root and fill in `PUBLIC_SANITY_PROJECT_ID`
3. `npm run sanity:dev` to run Studio locally, or `npm run sanity:deploy` to publish it

## Running with Docker

```bash
cp .env.example .env   # fill in your Sanity project ID
docker compose up -d --build
```

Site at `http://localhost:8080`, Sanity Studio at `http://localhost:8081`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel + DNS setup connecting this site to decorteindustries.com, or the Docker self-hosting section for running on your own server.
