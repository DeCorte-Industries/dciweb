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
- Captured 2026-08-09 from a legacy-style DNS panel (pre-migration). Source registrar/panel not confirmed in this doc — cross-check against whatever account this came from before making changes.
