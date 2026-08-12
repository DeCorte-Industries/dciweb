# DNS Record Backup — decorteindustries.com

Captured from the current DNS management panel before migrating nameservers/registrar (see `DEPLOYMENT.md`). Keep this until the migration is confirmed working, so any record can be restored if something breaks mid-transfer.

## Host Records

| Host Name | Record Type | Address / Value |
|---|---|---|
| @ | A | 216.239.32.21 |
| @ | A | 216.239.34.21 |
| @ | A | 216.239.36.21 |
| @ | A | 216.239.38.21 |
| calendar | CNAME | ghs.google.com. |
| docs | CNAME | ghs.google.com. |
| mail | CNAME | ghs.google.com. |
| sites | CNAME | ghs.google.com. |
| start | CNAME | ghs.google.com. |
| www | CNAME | ghs.google.com. |

## SRV Host Records

None configured.

## Email Settings (MX Records)

| Hostname | Type | Address | Priority |
|---|---|---|---|
| @ | MX | aspmx.l.google.com. | 10 |
| @ | MX | alt1.aspmx.l.google.com. | 20 |
| @ | MX | alt2.aspmx.l.google.com. | 20 |
| @ | MX | aspmx2.googlemail.com. | 30 |
| @ | MX | aspmx3.googlemail.com. | 30 |
| @ | MX | aspmx4.googlemail.com. | 30 |
| @ | MX | aspmx5.googlemail.com. | 30 |

Two additional MX rows and a wildcard (`* (other)`) MX row were present in the panel but left blank.

## Notes for migration

- The MX records are Google's standard Workspace mail routing set — these **must** be recreated exactly (same 5 hosts and priorities) at whichever DNS provider ends up authoritative (Cloudflare, per the current plan), or `@decorteindustries.com` email will stop working.
- The four `@` A records (216.239.32.x) and the `calendar` / `docs` / `sites` / `start` / `www` CNAMEs all point at `ghs.google.com` — this is Google's legacy "Google Sites custom domain" mapping, not the current dciweb site.
- **Confirmed by direct browser test (2026-08-09):**
  - `docs.decorteindustries.com` — **still resolves to something.** Keep this CNAME (`docs` → `ghs.google.com.`) when recreating records at the new host.
  - `mail.decorteindustries.com` — **still resolves to something.** Keep this CNAME (`mail` → `ghs.google.com.`) when recreating records at the new host.
  - `calendar.decorteindustries.com`, `sites.decorteindustries.com`, `start.decorteindustries.com` — **all failed to load.** Confirmed unused; safe to drop these three CNAMEs during migration.
- `www` and the root `@` will need to point at wherever the site is actually hosted (Vercel or Cloudflare, per `DEPLOYMENT.md`) rather than at `ghs.google.com`, regardless of the above.
- **When recreating `docs` and `mail` at Cloudflare, set their proxy status to "DNS only" (grey cloud), not Proxied.** Proxying them makes Cloudflare try to terminate SSL to the origin itself, which fails with a 525 "SSL handshake failed" error — confirmed 2026-08-12.
- **After switching to DNS-only, both still failed** — Firefox showed `PR_END_OF_FILE_ERROR`. Repointing the CNAME target from `ghs.google.com` to the currently-documented `ghs.googlehosted.com` did not fix it either (confirmed via `dig`: resolves correctly and freshly to a real Google IP, `142.250.177.243`, so this isn't a caching or wrong-target problem).
- **Root cause found (2026-08-12): this is a known, unfixable-at-DNS-level Google bug, not a migration issue.** Google Workspace's legacy custom-URL feature (map `mail`/`calendar`/`docs`/`drive`/`sites` to `ghs.googlehosted.com`) has never had valid SSL certificates provisioned for HTTPS — Google's server presents a cert covering only `*.googlehosted.com`/`*.google.com`, not the custom domain, so the TLS handshake always fails. Plain HTTP works; HTTPS doesn't, on any DNS host, and never has. This is why it "worked before" (almost certainly over HTTP or a stale connection) and fails now that browsers default to HTTPS-first. See [Google Workspace Custom Gmail URLs Are Broken: HTTPS Doesn't Work and Google Doesn't Care](https://chyshkala.com/blog/google-workspace-custom-gmail-urls-https-broken) for full root-cause writeup and the Cloudflare redirect-rule workaround (proxy the hostname, set SSL mode to "Flexible" for just that hostname, add a Redirect Rule to the real `mail.google.com`/`docs.google.com` URL — Cloudflare terminates HTTPS itself so the browser never touches Google's broken cert). Otherwise, treat `docs`/`mail` as dead like `calendar`/`sites`/`start` and drop them.
- **Confirmed 2026-08-12: `http://docs.decorteindustries.com` loads fine in Firefox; `https://` fails.** This is the exact signature the blog post describes — matches definitively. (DNS-over-HTTPS was investigated as a possible cause of the phone-vs-desktop inconsistency and ruled out; the HTTP/HTTPS split is the real and complete explanation.)
- Captured 2026-08-09 from a legacy-style DNS panel (pre-migration). Source registrar/panel not confirmed in this doc — cross-check against whatever account this came from before making changes.
