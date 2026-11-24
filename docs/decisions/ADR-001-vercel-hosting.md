# ADR-001: Host the profile on Vercel

**Status:** Accepted  
**Date:** 2026-11-06 (reconstructed from `REQUIREMENTS.md` R15 and the live Vercel project)

---

## Context

The profile site is a static multi-page Vite build with no application backend. It needs HTTPS, a custom domain (`ai.mileswaite.net`), and a simple path from `main` commits to production. The reference personal site at mileswaite.net remains a separate project and must not be modified by this work.

## Decision

Deploy the production build of project `mileswaite-profile` on **Vercel**, aliased to **https://ai.mileswaite.net**.

## Rationale

| Factor | Vercel | Alternatives |
|---|---|---|
| Fit for Vite static/MPA output | First-class | GitHub Pages needs extra SPA/MPA wiring |
| Custom domain + HTTPS | Built-in | Manual TLS on a VM |
| Preview / production aliases | Built-in | Homegrown CDN |
| Operational load | Low for a static site | Cloud Run / S3+CloudFront heavier than needed |

`REQUIREMENTS.md` R15 records a successful CLI production deploy aliased to `ai.mileswaite.net`, with deployment protection retained on non-custom preview URLs. The live project framework is Vite; domains include `ai.mileswaite.net` and `*.vercel.app` aliases.

## Consequences

- Contributors ship by merging to `main` (or promoting a Vercel production deploy); this repository’s CI validates build/HTML/links and does not deploy.
- No server runtime or secret material is required in the app for the static pages themselves.
- Preview deployments may sit behind Vercel authentication while the custom domain remains public — do not assume every `*.vercel.app` URL is anonymously reachable.
- Domain DNS and Vercel project settings live outside this git tree; document changes in an ADR or `REQUIREMENTS.md` when they affect contributors.
