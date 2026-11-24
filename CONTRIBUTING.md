# Contributing

Short human guide. Agents and detailed site rules: see [AGENTS.md](AGENTS.md).

## Setup

**Prerequisites:** Node.js 18+ (22 recommended), npm.

```bash
npm ci                 # or: npm install
```

Optional local hooks:

```bash
pip install pre-commit   # once
pre-commit install
pre-commit run --all-files
```

## Preview

```bash
npm run dev              # Vite local URL, hot reload
npm run build && npm run preview   # production build at http://127.0.0.1:4173
```

Edit homepage copy in `src/content.ts`. Case-study narrative: update `CASE_STUDY.md` and the matching HTML under `work/decision-intelligence/`. New essay pages go under `writings/` and need a Vite input entry plus a homepage writings list item.

## Checks

```bash
npm run build            # tsc --noEmit && vite build
```

CI also runs HTML validation (`html-validate`) and a lychee broken-link check. Known content/bot-block failures are listed in `lychee.toml` / `.htmlvalidate.json` with follow-ups in the PR that introduced them — do not delete those checks to go green.

## Branch and PR conventions

- Branch from `main` with a short, descriptive name.
- Keep PRs **small and focused** on one concern.
- Fill in the pull request template checklist.
- State assumptions, intentional link quirks, and follow-ups in the description.
- Do not commit secrets; do not put tokens in git remotes or config committed to the repo.
- Do not delete or weaken tests/checks solely to make CI pass.

## Definition of done

- Site principles in `AGENTS.md` respected (factual claims; intentional `WaiteM124` / `Milesy1` links; no invented metrics)
- `npm run build` passes; CI green
- No secrets in the change
- Docs updated when behaviour or workflow changes
- Accessibility and performance expectations met for touched pages
