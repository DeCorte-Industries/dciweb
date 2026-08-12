# Deploying dciweb

The site is a static Astro build, with content optionally managed in Sanity Studio. Three deployment paths are documented here:

- **Option A — Vercel**, pointing `decorteindustries.com` at Vercel's global CDN. Works well, but Vercel's free Hobby tier explicitly excludes commercial use — since dciweb is a business site, this really means paying for Pro (~$20/mo) to stay compliant.
- **Option C — Cloudflare (recommended)**, hosting on Workers static assets (free, commercial use explicitly allowed) and optionally moving the domain's registration there too. See below — this also covers migrating DNS away from its current Google Workspace/Enom setup, since that's a prerequisite either way.
- **Option B — Docker**, building both the site and Sanity Studio into containers you run on your own local server.

These aren't mutually exclusive — you can run Docker locally for development/staging and still use a paid host for the public production domain, or self-host everything.

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

1. The domain is registered through **Enom** (Google Workspace's underlying registrar partner for this account), not Google itself — manage DNS at Enom's control panel, not admin.google.com.
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

## Option C — Cloudflare (hosting + domain, recommended)

This combines three things that were originally separate questions into one ordered sequence, since the DNS migration is a shared prerequisite for both: moving `decorteindustries.com`'s DNS to Cloudflare, deploying dciweb on Cloudflare Workers, and (optionally) transferring the domain registration itself to Cloudflare Registrar.

Cloudflare's free tier explicitly allows commercial use (unlike Vercel's Hobby tier), and as of 2026 Cloudflare's own guidance is to deploy new static sites on **Workers with static assets** rather than the older Pages product — same result, just the currently-supported path.

Before starting, **`DNS_BACKUP.md` in this repo has the full current DNS record set**, including which of the old Google Sites subdomains (`docs`, `mail`) are confirmed still in use and which (`calendar`, `sites`, `start`) are confirmed safe to drop. Keep that file open through this whole process.

### 1. Push the repo to GitHub

Same as the Vercel path — skip if already done:

```bash
cd ~/Projects/dciweb
git init
git add .
git commit -m "Initial dciweb scaffold"
gh repo create decorteindustries/dciweb --private --source=. --push
```

### 2. Add the domain to Cloudflare (as a DNS zone — free, no registrar change yet)

1. In the Cloudflare dashboard, **Add a domain** → enter `decorteindustries.com`.
2. Cloudflare scans for existing records automatically, but don't rely on the scan alone — manually recreate the full set from `DNS_BACKUP.md`:
   - All 7 MX records (`aspmx.l.google.com` priority 10, `alt1`/`alt2.aspmx.l.google.com` priority 20, `aspmx2`–`aspmx5.googlemail.com` priority 30) — these keep `@decorteindustries.com` email working. Get these exactly right.
   - `docs` → CNAME → `ghs.google.com` — **set to "DNS only" (grey cloud), not Proxied.** If left proxied, Cloudflare tries to terminate SSL to the origin itself and you'll get a 525 "SSL handshake failed" error. Even DNS-only, `ghs.google.com` may no longer work at all — it's the old classic Google Sites endpoint, which Google retired; the current equivalent hostname is `ghs.googlehosted.com`. See `DNS_BACKUP.md` for the latest status before assuming this one still works.
   - `mail` → CNAME → `ghs.google.com` — same caveats as `docs` above.
   - Do **not** recreate `calendar`, `sites`, or `start` — confirmed unused.
   - Leave `@` (root) and `www` for now — those will point at the Workers deployment once it exists (step 3), not at `ghs.google.com`. **Important:** don't just leave the old `@` A records (`216.239.32.21` etc.) and `www` CNAME in place expecting them to get overwritten automatically — delete them before step 3.6. Cloudflare's Custom Domains feature refuses to attach a Worker to a hostname that already has externally-managed records and will fail with `Hostname 'decorteindustries.com' already has externally managed DNS records (A, CNAME, etc). Delete them first or try a different hostname.` if you skip this.
3. Cloudflare will show you two nameservers to set at your current registrar — since this domain is registered through **Enom**, that's where you'll make the change (not admin.google.com, which only manages Workspace apps/email, not DNS/nameservers for an Enom-registered domain).
4. If DNSSEC is enabled at Enom, disable it first and wait ~24 hours before changing nameservers, or DNS resolution can break partway through the switch.
5. Set the nameservers at Enom:
   1. Log in to Enom's reseller/control panel (whichever URL your account uses — commonly `https://www.enom.com/login.aspx`, or a white-labeled panel if the domain was purchased through a Google Workspace signup flow rather than directly from Enom).
   2. Go to **Domains** (sometimes labeled **My Domains** or **Domain List**) and select `decorteindustries.com` from the list.
   3. Open the domain's detail page and find **Nameservers** (sometimes under a **Host Settings** or **DNS** tab, separate from the actual DNS record editor — nameservers and individual DNS records are configured in different places).
   4. Switch the nameserver mode from whatever it's currently set to (often "Default"/Google's nameservers, or "Custom DNS") to **Custom Nameservers**.
   5. Clear out any existing nameserver entries and enter the two Cloudflare gave you in step 2 above, e.g. something like `aria.ns.cloudflare.com` and `walt.ns.cloudflare.com` — use the exact pair shown in your Cloudflare dashboard, they're assigned per-account and won't match anyone else's example.
   6. Save. Enom may ask you to confirm via email or a second screen — complete that if prompted.
6. Back in Cloudflare, wait for the zone status to flip from **Pending** to **Active** (usually minutes, can take up to 24 hours since nameserver changes propagate through global DNS caches). You can check propagation with `dig NS decorteindustries.com` from a terminal — once it returns Cloudflare's nameservers instead of Enom's/Google's, the switch has taken effect.

### 3. Deploy dciweb to Cloudflare Workers

1. **Workers & Pages → Create application → Import a Git repository**, connect GitHub, select the `dciweb` repo.
2. Confirm build settings: build command `npm run build`, static assets directory `dist`. No Cloudflare adapter is needed — `astro.config.mjs` already has `output: 'static'`.
3. If the repo has no `wrangler.jsonc`, Cloudflare opens a pull request adding one — merge it.
4. Environment variables — `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION` — are optional and only needed once a real Sanity project exists. If you don't have one yet, **don't add these rows at all** (Cloudflare's env var UI requires a value once a row exists, and an empty string isn't the right move here). With no `PUBLIC_SANITY_PROJECT_ID` set, `src/lib/sanity.ts` skips creating the Sanity client and every page falls back to its built-in default content — the same behavior already used in local dev. Once you run `npx sanity init` and have a real project ID, add the three real values and trigger a fresh deploy (they're baked in at build time, so the existing build won't pick them up without a rebuild).
5. Deploy, and verify on the `*.workers.dev` URL before touching the domain.
6. In the Worker's settings, add `decorteindustries.com` and `www.decorteindustries.com` as custom domains. Since the zone is already active on Cloudflare from step 2, this now points `@` and `www` at the site instead of the old `ghs.google.com` records.

SSL is automatic once the custom domain is attached — no separate step.

### 4. Verify before doing anything else

- Load `https://decorteindustries.com` — confirm the site works.
- Send a test email to `info@decorteindustries.com` — confirm mail still delivers (this is why the MX records had to be exact in step 2).
- Load `https://docs.decorteindustries.com` and `https://mail.decorteindustries.com` — confirm those still resolve as before.

Don't move on to the registrar transfer until all three check out. If something's broken, you can revert by changing the nameservers back to Enom's originals at any point — nothing is destructive until you approve the transfer in step 5.

### 5. (Optional) Transfer the domain registration to Cloudflare

Only do this once step 4 is fully verified. Cost is at-cost with no markup — currently around $10/year for `.com`, and the transfer adds a free one-year extension.

1. At Enom: unlock the domain and request the authorization/EPP code — in the same domain detail page as the nameserver settings above, look for **Domain Lock** (toggle it off) and **Get Auth Code** / **EPP Code** (usually emailed to the account's registrant contact rather than shown on-screen directly).
2. In Cloudflare: **Transfer Domains** → enter the domain and the auth code → pay.
3. Approve the confirmation email — this comes from Enom (or from whatever registrar/reseller relationship the Workspace signup created), so check the inbox tied to the domain's registrant contact if it doesn't show up right away.
4. Wait up to ~5 business days (up to 10 for some TLDs) for it to complete.

The domain must have been registered/last transferred more than 60 days ago (ICANN rule) — not an issue here.

### Rollback

- Before the registrar transfer: revert nameservers to Enom's originals. DNS returns to exactly what's documented in `DNS_BACKUP.md`.
- After the registrar transfer: the domain now lives at Cloudflare permanently (transfers aren't easily reversible), but DNS records themselves can still be edited or pointed elsewhere at any time — you're not locked into Workers hosting just because Cloudflare is the registrar.

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
