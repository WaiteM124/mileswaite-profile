# AGENTS.md — Miles Waite profile site

Single source of truth for humans and AI agents (including Cursor) working in this repository.

**Site:** Personal engineering profile at [https://ai.mileswaite.net](https://ai.mileswaite.net). Homepage with a Three.js cylinder hero, engineering context, selected work, writings, and contact. Flagship case study and essay pages are additional static HTML entries in a Vite multi-page app.

**Owner:** Miles Waite. Source repo: `WaiteM124/mileswaite-profile`. Deployed on Vercel (project `mileswaite-profile`) to the custom domain above.

---

## Repository map

| Path | Role |
|---|---|
| `index.html` | Homepage shell; mounts `/src/main.ts` |
| `src/main.ts` | Homepage DOM: header, hero copy, engineering context, work, writings, contact |
| `src/content.ts` | Editable homepage copy, work items, writings list, and contact links |
| `src/hero.ts` / `src/cylinder.ts` | Hero render loop and Three.js scene (ported from mileswaite.net) |
| `src/theme.ts` / `src/scroll-progress.ts` / `src/style.css` | Theme toggle, scroll progress line, styles |
| `src/case-study.ts` | Shared helpers for static pages |
| `work/decision-intelligence/` | Flagship architecture case-study page |
| `writings/` | Static essay / update pages (registered in `vite.config.ts`) |
| `public/images/` / `public/downloads/` / `public/contracts/` | Served assets (architecture diagram, A2A contracts markdown, JSON Schema `$id` targets) |
| `design-input/` | Source copies of diagram and contracts; keep in sync with `public/` |
| `CASE_STUDY.md` | Narrative source for the case-study HTML |
| `REQUIREMENTS.md` | Living product/requirements spec and acceptance traceability |
| `docs/decisions/` | Architecture decision records |
| `.github/workflows/ci.yml` | PR/push CI: TypeScript build, HTML validate, lychee link check |

Stack: **Node.js 18+** (CI uses 22), **Vite 6** MPA, **TypeScript**, runtime dependency **`three@0.180.0`** only. No React, router, CMS, or backend in this repo.

---

## Site principles (non-negotiable)

1. **Factual claims match the CV and LinkedIn.** Do not invent roles, dates, employers, or credentials. Metrics and evaluation numbers on the site must match measured evidence already stated in copy or source docs — never invent or inflate them.
2. **No invented features or URLs.** Do not add repository, demo, or results links until a real URL exists. Do not invent product capabilities.
3. **Intentional account split.** Selected-work repository links under `WaiteM124` and the contact GitHub link to `Milesy1` are intentional. Do not “correct”, flag, or unify them.
4. **Faithful hero.** Keep the cylinder geometry, seed, colours, speeds, camera, and tilt aligned with the mileswaite.net `RotatingCylinderLinesR3F` port described in `README.md` / `REQUIREMENTS.md`. Do not replace it with a lookalike effect.
5. **Quiet page, rich hero.** No font packages, icon libraries, or photographs beyond the supplied architecture diagram. Colour and type live in `src/style.css`. Engineering context stays plain text — not floating type or opacity animation.
6. **Case study integrity.** When the narrative changes, update `CASE_STUDY.md` and transcribe the same wording into `work/decision-intelligence/index.html`. Keep illustrative recommendations labelled as structure, not market research or live performance results. Do not redraw the architecture diagram or rewrite the contract JSON examples.

---

## Engineering standards

- **Small, focused PRs.** One concern per PR; clear title and description; state assumptions and out-of-scope items.
- **Checks green before merge.** Local build (`npm run build`) and CI (HTML validation, link check) must pass. Never delete, skip, or weaken checks solely to make CI pass — fix the issue or document a justified ignore/follow-up.
- **No secrets in git.** No API keys, tokens, credentials, or private keys in source, config, commit messages, or git remotes. Prefer environment / host secret stores for deploy credentials.
- **Pin versions for production-bound work.** Prefer pinned dependency and Action versions (`three@0.180.0`, SHA-pinned Actions). Do not silently bump runtime deps in a content PR.
- **Accessible and performant pages.** Valid HTML; keyboard focus styles; theme control hit target; `prefers-reduced-motion` respected for the hero; pixel-ratio capped; hero pauses off-screen. Keep the bundle lean — no unnecessary libraries.
- **Docs track behaviour.** Update `README.md`, `REQUIREMENTS.md`, `AGENTS.md`, ADRs, or `CONTRIBUTING.md` when layout, workflow, deploy, or contribution rules change.

### Definition of done

- [ ] Site principles above respected (especially factual claims and intentional links)
- [ ] `npm run build` succeeds
- [ ] CI green (or documented ignores with follow-ups — never silent weakening)
- [ ] No secrets introduced
- [ ] Docs updated if behaviour or workflow changed
- [ ] Accessibility and performance expectations met for touched pages

---

## How to preview locally

```bash
npm install          # or npm ci
npm run dev          # Vite prints a local URL; hot reload on edit
```

Production build and preview:

```bash
npm run build
npm run preview      # serves dist at http://127.0.0.1:4173
```

Homepage copy: edit `src/content.ts`. New static pages: add HTML under `work/` or `writings/`, register the entry in `vite.config.ts` `build.rollupOptions.input`, and link from content where appropriate.

---

## Workflow for agents

1. **Read before writing.** Inspect the real layout, `README.md`, `REQUIREMENTS.md`, and neighbouring pages. Prefer matching existing patterns.
2. **Plan large changes.** For multi-file or cross-cutting work, outline the approach, files touched, and risks before coding. Keep scope to the assigned task.
3. **Docs/config-only vs site content.** If the task says docs/config/CI only, do not change site content, design, or behaviour.
4. **Do not weaken checks.** Never delete or loosen CI, validators, or ignores solely to pass. Prefer config ignores for known content issues and list them as follow-ups.
5. **State assumptions in the PR.** Call out concurrent work, intentional link quirks, and anything left as follow-up.
6. **Cursor rules.** Follow `.cursor/rules/*.mdc`; they summarise this file for scoped globs. When in conflict, **this file wins**.

---

## Related docs

- [CONTRIBUTING.md](CONTRIBUTING.md) — short human setup and PR conventions
- [README.md](README.md) — site overview and editing notes
- [REQUIREMENTS.md](REQUIREMENTS.md) — requirements and acceptance traceability
- [docs/decisions/](docs/decisions/) — architecture decision records
- [CASE_STUDY.md](CASE_STUDY.md) — case-study narrative source
