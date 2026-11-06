# Requirements

Living specification for the profile at `mileswaite-profile`. The public origin is `https://ai.mileswaite.net`. The reference site at `mileswaite.net` is read-only.

## Highest-risk assumption

The homepage hero can be reused without Next.js, React, React Three Fiber, Tailwind, or Framer Motion.

Inspected source: `mileswaite.net/components/RotatingCylinderLinesR3F.tsx`, mounted by `app/page.tsx`. It is not a shader and it does not use `@react-three/drei`. The picture is three nested cylinders of `THREE.Line` arcs (white `#ffffff` outside, red `#ff0000`, green `#00ff00` inside). Each arc’s parent group rotates on Y by a fixed step per frame (`0.05625` or `0.0225`; the green cylinder is reversed). The group is tilted (`rotation.x = 0.5`, `rotation.z = 0.2`). The camera is `position [0, 0, 3.5]`, `fov 75`. The black field is the canvas CSS background `#000000`. `LineBasicMaterial` is unlit, so the three lights do not change the pixels.

`components/RotatingCylinderLines.tsx` is a different scene (camera `z = 5`, fog, different gap seeds, different ambient colour). It is not the homepage hero and is not ported.

Decision: port the homepage scene into vanilla Three.js `0.180.0` (the reference version) with a Vite + TypeScript host. React is not required for a faithful port. Added behaviour (pause, reduced motion, fallback, cleanup) wraps that same scene.

## Requirements

### R1. Faithful hero

Reuse the homepage cylinder, not a lookalike particle effect.

Acceptance:

- Segment counts, radii (`1.2`, `1`, `0.8`), colours, speeds, reverse flags, 21-point arcs, 40% seeded gaps, camera, and tilt match `RotatingCylinderLinesR3F.tsx`.
- The gap seed stays `(Math.sin(row * 100 + col + offset) * 10000) % 1`, including negative results.
- Rotation stays a per-frame increment, as in `useFrame`, not a delta-time rewrite.
- Source files are named in this document and the README.

### R2. Reference project untouched

Acceptance: `mileswaite.net` has no edits from this work.

### R3. Separate project

Acceptance: the site lives only in `C:\Users\Miles\Desktop\Projects\mileswaite-profile`.

### R4. This document

Acceptance: each requirement below has an ID, a measurable check, and a row in the traceability table. Update the table when a decision changes.

### R5. Quiet page, rich hero

Off-white ground, dark text, one accent taken from the hero red, system type, thin rules, no cards, photos, decorative gradients, icon fonts, or motion outside the hero. The hero keeps its black field.

Acceptance: the only continuous animation is the cylinder. Accent `#c41212` is the hero red `#ff0000` darkened just enough to clear 4.5:1 on `#f3f2ee` (measured 5.45:1) for link text and focus.

### R6. Header

“Miles Waite”, plus anchors to Work and Contact only.

Acceptance: on the homepage those two anchors scroll to `#work` and `#contact`. On `/work/decision-intelligence/` they go to `/#work` and `/#contact`. No other navigation. The case-study page does not invent local `#work` or `#contact` targets.

### R7. Compact hero copy

Visible without excessive scrolling on a typical laptop: name Miles Waite, title Distinguished Frontier Engineer, the introduction below, and “View selected work”.

Introduction:

> Building governed, evaluation-driven AI systems that reason over live enterprise data and take real actions under auditable human control.

The name, role, introduction, and “View selected work” are centred together under the animation. The header, selected work, and contact stay left-aligned. The introduction uses a 36rem measure and the full column when the column is narrower. `text-wrap: balance` evens the lines. There are no forced line breaks.

Acceptance: at 1440×900 and 1024×768 the name, title, and introduction sit in the first viewport. The canvas is square and capped near 280px so the scene is scaled, not stretched. At 375, 768, 1024, and 1440 the introduction wraps without overflow or a hard line break.

### R8. Hero runtime

Acceptance:

- Responsive: drawing-buffer size tracks the CSS box times `min(devicePixelRatio, 2)`.
- Pauses when the hero is off-screen or `document.hidden`, and resumes with a single `requestAnimationFrame` loop.
- Cancels the frame, disconnects observers, removes listeners, and disposes geometries, materials, and the renderer.
- `prefers-reduced-motion: reduce` shows one real frame and does not keep animating.
- If WebGL fails or the context is lost, an SVG of the same arcs in the initial pose replaces the canvas. The failure state is not an empty black rectangle.
- The hero root is `aria-hidden="true"`.

### R9. Selected work

Editorial list with rules, not a card grid.

| Piece | Body | Link |
| --- | --- | --- |
| Flagship: Autonomous Enterprise Decision Intelligence Platform | A multi-agent platform for investigating complex enterprise decisions. Specialist agents analyse independent business domains, critically review findings, and synthesise evidence into a structured recommendation for human decision-makers. | One text link only: “Read the architecture and design case study” → `/work/decision-intelligence/`. No repository, demo, or results link. |
| Self-Learning AP Automation | Non-PO invoices arrive without a purchase order to anchor their coding. The system retrieves similar historically coded lines, then uses specialist agents to assess the entity, VAT treatment, and cost centre. A separate reasoning step reviews agent disagreements before routing each line to automatic posting or human review. Agent flags can escalate a decision, but never override a human. Then: Evaluation context: The system was evaluated on 11,118 real invoice lines from the LA Checkbook dataset. It achieved a 71.5% automation rate at 99.47% accuracy. Automation refers to work routed to automatic posting rather than manual review; the objective is dependable automation with explicit controls, not maximum automation at any cost. | https://github.com/WaiteM124/ap-automation |
| Governed ERP Automation | The platform lets employees query and operate a live ERP through natural-language Slack conversations. It supports AP/AR workflows including invoices, receipts, payments, journals, and credit notes. It can also chain multiple tool calls to investigate questions such as why invoices remain outstanding or calculate a customer’s net financial position. Then: Architecture context: The 90+ tools are discrete ERP operations exposed to the agent — not 90+ autonomous agents. Consequential writes pass through middleware enforcing approval queues, idempotency, and audit logging. Humans approve controlled actions before execution, while distributed tracing connects each conversation, tool execution, and downstream API call for diagnosis and accountability. | https://github.com/WaiteM124/governed-agent-toolkit |
| Enterprise RAG Assistant | The assistant gives consultants natural-language access to organisational knowledge without manually searching across documents. It combines keyword and semantic retrieval to find relevant material, then generates grounded answers. Separate tenant-specific collections keep each organisation’s data isolated. Then: Evaluation context: The assistant serves 200+ active users across two tenants, with sub-three-second median latency. Its 9.1/10 score is the average result on a purpose-built 500+ question golden dataset, evaluated with RAGAS and validated through human review — not a score from a generic public benchmark. Releases are gated against the dataset, with low-scoring cases reviewed before changes are accepted. | https://github.com/WaiteM124/miles-rag |

Acceptance: the flagship keeps its single summary paragraph and has exactly one link, the case study. It has no repository, demo, or results link. Each of the other three shows the explanation, then the labelled context paragraph. The hrefs match the table. The old `Meles123` and `Milesy1` repository URLs are not rendered.

### R10. Contact

Only these:

- https://www.linkedin.com/in/miles-waite-46628a3b2/
- https://github.com/Milesy1
- mailto:waite.miles@proton.me

Acceptance: no Instagram, no placeholder href, no dead button.

### R11. Light stack

Static pages, Vite, TypeScript, and `three`. Homepage content in one data file. The case study is static HTML transcribed from `CASE_STUDY.md`.

Acceptance: the only runtime dependency is `three@0.180.0`. Dev dependencies are Vite, TypeScript, and `@types/three` (three 0.180 does not ship its own types). No React, router, CMS, backend, component library, icon package, font file, or bitmap. The production build emits `dist/work/decision-intelligence/index.html`. There is no SPA fallback.

### R12. Document and access

Acceptance:

- Homepage: `<title>`, meta description, viewport, Open Graph title and description, and Twitter card title and description are present. The homepage has no canonical link and no share image.
- Case-study page: title, meta description taken from the study dek, canonical URL exactly `https://ai.mileswaite.net/work/decision-intelligence/`, and Open Graph title and description are present. No `og:image`.
- Body text contrast is at least 4.5:1. Focus is visible. Every link’s box is at least 44×44px.
- No horizontal overflow at 375, 768, 1024, and 1440 CSS pixels on the homepage or the case-study page.

### R13. Production build

Acceptance: `npm run build` exits 0.

### R14. Browser check

Acceptance: the production preview is opened in a browser. Desktop and mobile screenshots are reviewed. The console has no errors, unhandled rejections, or missing assets. Internal anchors, external hrefs, reduced motion, and pause/resume are exercised.

### R15. Production deploy

The profile is deployed to `https://ai.mileswaite.net`.

Acceptance: a Vercel CLI production deploy of project `mileswaite-profile` completes. The live case-study HTML contains “Architecture and design study”. The live homepage bundle contains “Engineering context”. Deployment protection stays on. The reference repo is not modified.

### R16. Decision-intelligence case study

A static page at `/work/decision-intelligence/`, transcribed from `CASE_STUDY.md`.

Acceptance:

- Vite multi-page input `work/decision-intelligence/index.html` is emitted as `dist/work/decision-intelligence/index.html`. Refreshing that path serves the file. No SPA fallback.
- One H1: “Autonomous Enterprise Decision Intelligence Platform”.
- “Architecture and design study” is a visible status label.
- The illustrative recommendation is labelled as intended structure, not actual market research or performance results.
- No benchmark scores, customer evidence, production claims, or repository links are added.
- Governance boundaries and evaluation criteria from `CASE_STUDY.md` appear in the same order and wording.
- “Back to selected work” links to `/#work`. The closing link returns to `/`.
- The agent table has real headers. Narrow screens stack it into labelled agent sections and do not scroll the page sideways.
- Homepage hero animation is unchanged.

### R17. Engineering context

A homepage section between the hero and Selected Work.

Acceptance:

- One heading: “Engineering context”.
- Three left-aligned paragraphs, and no other claims: twenty years of enterprise risk architecture and real-time systems extended into current production AI work; floating maxima under opacity as a conceptual stress-testing approach; robust systems resist stress, and antifragile systems use evidence from stress and failure to strengthen evaluations, controls, and recovery paths through human engineering. Opacity means incomplete knowledge of future conditions rather than hidden system behaviour.
- No floating type, opacity effect, cards, diagrams, or icons.
- The hero and the Work/Contact navigation stay as they are.

## Scope exclusions

- Blog, CMS, database, authentication, backend, analytics
- Dark mode
- Framer Motion entrance used on the old homepage
- The generative-sketch, p5, and non-homepage cylinder variants
- A time-corrected rewrite of the rotation speed
- A social preview image
- A repository, demo, or results link on the flagship

## Traceability

| ID | Design decision | Location | Result |
| --- | --- | --- | --- |
| R1 | Vanilla port of the R3F homepage scene, same parameters and seed | `src/cylinder.ts`, `src/hero.ts` | Pass. 203 arcs. Running frames differ; the still matches the SVG fallback |
| R2 | No writes under `mileswaite.net` | — | Pass. This work did not edit the reference tree |
| R3 | New directory, workspace moved here | project root | Pass. `C:\Users\Miles\Desktop\Projects\mileswaite-profile` |
| R4 | Single living requirements file | `REQUIREMENTS.md` | Pass |
| R5 | Off-white `#f3f2ee`, ink `#1c1c1c`, muted `#5e5c57` (5.96:1), accent `#c41212` (5.45:1), 1px rules | `src/style.css` | Pass. Contrast measured. Screenshots show one accent and no cards |
| R6 | Homepage anchors scroll to `#work` and `#contact`. Case-study header links go to `/#work` and `/#contact` | `src/main.ts`, `work/decision-intelligence/index.html` | Pass. Homepage nav hrefs are `#work` and `#contact`. Case-study Work and Contact landed on `http://127.0.0.1:4173/#work` and `#contact`. Back to selected work landed on `/#work` with Selected work in view |
| R7 | Centred hero copy under the 17.5rem square. Intro measure `min(36rem, 100%)` with `text-wrap: balance`. Hero bottom padding `1.75rem`. Engineering context now sits between the hero and Selected Work | `src/style.css`, `src/main.ts` | Pass. At 1024×768 the introduction bottom is 550px and its width is 576px. Engineering context is the next section |
| R8 | One rAF loop, IO + visibility pause, DPR cap 2, SVG fallback, reduced-motion still | `src/hero.ts` | Pass. Paused off-screen and resumed running. Reduced-motion screenshots were byte-identical. Context loss replaced the canvas with 203 SVG arcs. DPR 2 produced a 560px buffer for the 280px box |
| R9 | Flagship summary unchanged, with exactly one link to the case study and no repository, demo, or results link. The other three keep their WaiteM124 URLs and context paragraphs | `src/content.ts`, `src/main.ts` | Pass. The flagship link is `/work/decision-intelligence/`. AP Automation, governed-agent-toolkit, and miles-rag still use the WaiteM124 URLs |
| R10 | Contact email is `mailto:waite.miles@proton.me` | `src/content.ts`, `index.html` | Pass. Visible text and href match. `googlemail` is absent from the source and the build |
| R11 | Vite multi-page build. Homepage content in `src/content.ts`. Case study is static HTML. Runtime dependency remains `three@0.180.0` | `package.json`, `vite.config.ts`, `work/decision-intelligence/index.html` | Pass. Build emitted `dist/work/decision-intelligence/index.html`. JS 485.84 kB (124.08 kB gzip), CSS 4.77 kB (1.57 kB gzip). An `appType: 'mpa'` preview served the case study and returned 404 for a missing path |
| R12 | Homepage head tags unchanged and still without a canonical or share image. Case-study page has title, dek description, canonical `https://ai.mileswaite.net/work/decision-intelligence/`, and Open Graph title and description. No `og:image` | `index.html`, `work/decision-intelligence/index.html`, `src/style.css` | Pass. Canonical and Open Graph match the study dek. No `og:image`. Overflow was 0 at 375, 768, 1024, and 1440 on both pages. Every measured link box was at least 44px tall. `:focus-visible` is a 2px accent outline |
| R13 | `tsc --noEmit` then `vite build` | `package.json` | Pass. Exit 0 |
| R14 | Preview the `dist` build, including the case-study URL and a reload | — | Pass. Direct loads of `/work/decision-intelligence/` returned the case study, including a second load. Hero canvas was `running` on screen and `paused` once off screen. CSS and JS returned 200 |
| R15 | Production deploy to `https://ai.mileswaite.net` | Vercel project `mileswaite-profile` | Pass. CLI production deploy `dpl_6GdPWJAzAV9YBvGTtBZKMmvyMwkL` is aliased to `https://ai.mileswaite.net`. Deployment protection remains `vercel_authentication`. The live case-study HTML contains “Architecture and design study”. The live homepage bundle `main-BhDxlgY2.js` contains “Engineering context” |
| R16 | Static case study transcribed from `CASE_STUDY.md` | `work/decision-intelligence/index.html`, `CASE_STUDY.md` | Pass. One H1. Status label and illustrative-output disclaimer are visible. Governance and evaluation sections are present in source order. The agent table stacks at 375px and remains a table from 768px up |
| R17 | Engineering context between the hero and Selected Work | `src/content.ts`, `src/main.ts`, `src/style.css` | Pass. Three left-aligned paragraphs sit between the hero and Selected Work at desktop and at 375px. No overflow |

## Implementation notes

- Homepage host: `app/page.tsx` dynamically imports `RotatingCylinderLinesR3F` (client only, after two animation frames). Sizing classes on that page run from 20rem to 36rem. This page uses a smaller square on purpose (R7) without changing camera or geometry.
- React Three Fiber’s canvas defaults `dpr` to `[1, 2]` and does not pause when off-screen. The cap is preserved. Pause, reduced motion, and fallback are new and required by R8.
- The homepage still has no `og:image` and no canonical link. The case-study page sets canonical and `og:url` to `https://ai.mileswaite.net/work/decision-intelligence/` and does not set `og:image`.
- Hero copy is centred with `text-align: center` on `.hero` only. The introduction measure is `min(36rem, 100%)`. Hero bottom padding is `1.75rem`. Engineering context is the next section, using the same left-aligned section rule as Selected Work.
- The case study is not generated from Markdown at build time. `CASE_STUDY.md` is the source, and `work/decision-intelligence/index.html` is the page. Vite’s multi-page input emits that file; `appType: 'mpa'` keeps a missing path from falling back to the homepage.
- Contact address is `waite.miles@proton.me`. The contact GitHub profile remains `https://github.com/Milesy1`. Project repositories use `https://github.com/WaiteM124/ap-automation`, `governed-agent-toolkit`, and `miles-rag`.
