# Deploying dciweb

The site is a static Astro build, with content optionally managed in Sanity Studio. Two deployment paths are documented here:

- **Option A — Vercel**, pointing `decorteindustries.com` (managed through Google Workspace) at Vercel's global CDN.
- **Option B — Docker**, building both the site and Sanity Studio into containers you run on your own local server.

These aren't mutually exclusive — you can run Docker locally for development/staging and still use Vercel for the public production domain, or self-host everything.

---

## Option A — Vercel + decorteindustries.com

Your domain (`decorteindustries.com`) is currently registered/managed through Google Workspace, which also handles your email (MX records) — that stays untouched. Only DNS records for the website itself point to Vercel.

### 1. Push the repo to GitHub

```bash
cd ~/Projects/dciweb
git init
git add .
git commit -m "Initial dciweb scaffold"
gh repo create decorteindustries/dciweb --private --source=. --push
```

(Or create the repo on github.com and `git remote add origin ...` + `git push`.)

### 2. Create the Vercel project

1. Go to vercel.com, sign in (GitHub login is easiest), and click **Add New → Project**.
2. Import the `dciweb` GitHub repo.
3. Framework preset: Vercel auto-detects **Astro** — leave build command as `npm run build` and output directory as `dist`.
4. Add environment variables (Settings → Environment Variables), if using Sanity:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET` (`production`)
   - `PUBLIC_SANITY_API_VERSION` (`2024-01-01`)
5. Deploy. You'll get a working `dciweb.vercel.app` URL — confirm the site loads correctly before touching DNS.

### 3. Point decorteindustries.com at Vercel

In the Vercel project: **Settings → Domains → Add** → enter `decorteindustries.com` (and `www.decorteindustries.com`). Vercel will show you the exact DNS records it needs — typically:

| Type | Host | Value |
|---|---|---|
| A | `@` (root) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

(Always use the values Vercel displays for your project — they're generated per-project and may differ slightly.)

#### Adding these in Google Workspace / Google Domains DNS

Your domain's DNS is managed wherever it's registered — if that's still Google Domains/Workspace's domain product:

1. Go to **admin.google.com** → **Menu → Account → Domains → Manage domains**, or if the domain was transferred to Squarespace (Google sold Google Domains to Squarespace in 2023), manage DNS at **domains.squarespace.com** instead. Check which one currently holds the registration first.
2. Open **DNS settings** for `decorteindustries.com`.
3. Do **not** touch existing `MX` records — those route your `@decorteindustries.com` email through Google Workspace and are unrelated to the website.
4. Add the **A record**: host `@`, value `76.76.21.21` (or whatever IP Vercel shows), TTL default.
5. Add the **CNAME record**: host `www`, value `cname.vercel-dns.com`.
6. If a placeholder/parking `A` or `CNAME` record already exists for `@` or `www`, delete or replace it so there's no conflict — Vercel's domain check will flag conflicts if they remain.
7. Save. DNS propagation is typically fast (minutes) but can take up to 24–48 hours.

### 4. SSL and verification

Vercel automatically issues and renews a free SSL certificate (Let's Encrypt) once DNS resolves correctly — no action needed. Check **Settings → Domains** in Vercel; both `decorteindustries.com` and `www.decorteindustries.com` should show a green "Valid Configuration" checkmark. Set the root domain as primary and redirect `www` to it (or vice versa) in the same screen.

### 5. Auto-deploys

Once connected, every `git push` to `main` triggers a new production deploy automatically. Pull requests get their own preview URLs.

### 6. Sanity Studio (optional, if using CMS content)

The `sanity/` folder is a separate Sanity Studio project.

```bash
cd sanity
npx sanity init          # creates the project on sanity.io, gives you a project ID
npx sanity deploy        # publishes Studio to https://dciweb.sanity.studio (or a name you choose)
```

Put the resulting project ID into Vercel's `PUBLIC_SANITY_PROJECT_ID` env var (and your local `.env`) and redeploy.

### Rollback

If something breaks after a deploy, Vercel keeps every previous deployment — go to the **Deployments** tab and click **Promote to Production** on the last good one. No DNS changes needed for rollback.

---

## Option B — Docker (self-hosted on your local server)

This builds two containers via `docker-compose.yml`:

- **`web`** — the public site, built by Node and served by a lightweight `nginx:alpine` image (see `Dockerfile` + `docker/nginx.conf`).
- **`studio`** — Sanity Studio, built the same way (see `sanity/Dockerfile` + `sanity/nginx.conf`).

Both are static-file builds — nginx just serves pre-built HTML/CSS/JS, no Node process runs at container runtime.

### 1. Configure environment variables

```bash
cd ~/Projects/dciweb
cp .env.example .env
```

Edit `.env` and fill in your real Sanity project ID (same one from `npx sanity init`) for both `PUBLIC_SANITY_PROJECT_ID` and `SANITY_STUDIO_PROJECT_ID`. `WEB_PORT` / `STUDIO_PORT` control which local ports the containers bind to (default `8080` and `8081`).

**Important:** these values are baked into the static build at *build time* (Vite/Astro and Sanity Studio both inline `PUBLIC_*` / `SANITY_STUDIO_*` vars into the JS bundle). Changing `.env` after the fact requires a rebuild — restarting the container alone won't pick up new values.

### 2. Build and run

```bash
docker compose build
docker compose up -d
```

Site: `http://<your-server>:8080`
Studio: `http://<your-server>:8081`

Check logs with `docker compose logs -f`, stop with `docker compose down`.

### 3. Updating after code or content changes

```bash
git pull
docker compose build
docker compose up -d
```

Since these are static builds, a new Sanity content publish doesn't automatically show up — you need to rebuild the `web` image (`docker compose build web && docker compose up -d web`) to pick up fresh content. If you want that to happen automatically, the same Sanity webhook approach mentioned in the aauweb plan applies here — point a webhook at a small script on your server that runs the rebuild command.

### 4. Exposing this publicly (optional)

If you want `decorteindustries.com` to point at your local server instead of Vercel, you'll need your own reverse proxy in front of these containers to handle TLS and the domain — e.g. Caddy, Traefik, or Nginx Proxy Manager — since the containers here only listen on plain HTTP. That's a bigger step (port forwarding, dynamic DNS if your IP isn't static, certificate renewal) and isn't set up by default; happy to add it if you decide to go that route.

### Troubleshooting

- **Blank page / 404s on refresh at a sub-path** — for `web`, check `docker/nginx.conf`'s `try_files` rule matches your route structure; for `studio`, it should always fall back to `index.html` (it's a single-page app).
- **Old content or wrong Sanity project showing** — you likely changed `.env` without rebuilding; see step 1.
- **Port already in use** — change `WEB_PORT` / `STUDIO_PORT` in `.env` and re-run `docker compose up -d`.
