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

Off-white ground, dark text, one accent taken from the hero red, system type, thin rules, no cards, photos, icon fonts, or motion outside the hero and the scroll line. The hero keeps its black field. A header control switches the page between that light theme and a dark theme. The choice is stored in `localStorage` under `miles-theme`. With no stored choice, the page follows `prefers-color-scheme`. Header underlines are the exception in R6.

Light: background `#f3f2ee`, text `#1c1c1c`, muted `#5e5c57` (5.96:1), accent `#c41212` (5.45:1). Dark: background `#141413`, text `#f3f2ee`, muted `#b9b6ae`, accent `#ff5c5c`. Both accents clear 4.5:1 on their background.

Acceptance: the only continuous animation is the cylinder. The scroll line is the left-edge progress bar from `mileswaite.net`, not a second animation loop.

### R6. Header

“Miles Waite”, plus anchors to Work and Contact. The theme control is separate: a fixed button in the top-right corner of the viewport, on both pages, not in the header row.

The control shows D while the light theme is active and L while the dark theme is active. Its accessible name is “Switch to dark theme” or “Switch to light theme”. The hit area is at least 44×44px. It does not cover the name or widen the page.

Work, Contact, and that control are the only header underlines. On each full page load the page chooses red or green with equal chance (`Math.random() < 0.5`) and does not write that choice to `localStorage`. Light theme uses the chosen colour: red `#c41212` (5.45:1 on `#f3f2ee`) or green `#0c6b2c` (5.94:1 on `#f3f2ee`). Dark theme uses `#f3f2ee`. The light theme never uses white. These colours are set on `html[data-header-ink]` and `html[data-theme='dark']` so they win over the general `.link` accent underline. In-content links, including project repositories, the email, case-study body links, and back links, keep the accent underline.

Acceptance: on the homepage those two anchors scroll to `#work` and `#contact`. On `/work/decision-intelligence/` they go to `/#work` and `/#contact`. The case-study page does not invent local `#work` or `#contact` targets. A reload can change the light-theme header underline between red and green. The dark theme paints those underlines `#f3f2ee` on the same load, and returning to light restores that load’s colour rather than white. The control reads D or L and stays in the top-right corner.

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

Acceptance: the only runtime dependency is `three@0.180.0`. Dev dependencies are Vite, TypeScript, and `@types/three` (three 0.180 does not ship its own types). No React, router, CMS, backend, component library, icon package, font file, or bitmap other than the supplied architecture diagram in R19. The production build emits `dist/work/decision-intelligence/index.html`. There is no SPA fallback.

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
- The narrative stays transcribed from `CASE_STUDY.md`. The diagram and contract examples are additional material specified in R19–R21.

### R17. Engineering context

A homepage section between the hero and Selected Work.

Acceptance:

- One heading: “Engineering context”.
- Three left-aligned paragraphs, and no other claims: twenty years of enterprise risk architecture and real-time systems extended into current production AI work; floating maxima under opacity as a conceptual stress-testing approach; robust systems resist stress, and antifragile systems use evidence from stress and failure to strengthen evaluations, controls, and recovery paths through human engineering. Opacity means incomplete knowledge of future conditions rather than hidden system behaviour.
- No floating type, opacity effect, cards, diagrams, or icons.
- The hero and the Work/Contact navigation stay as they are.

### R18. Scroll line and theme

A 3px bar fixed to the left edge, hidden below 768px, matching `mileswaite.net/components/ScrollProgressIndicator.tsx`. A faint track is always visible at that width. Its fill grows with scroll position. Light fill runs from near-black to red. Dark fill runs from white to green. `prefers-reduced-motion: reduce` leaves only the track.

The same theme and scroll line are on the homepage and the case-study page. Switching theme also switches the header underlines in R6. The scroll line does not follow that rule: its light fill stays near-black into red, with no white, and its dark fill stays white into green.

Acceptance: scrolling changes the fill height. Switching theme changes the page colours, the header underlines, and the line gradient. The theme choice survives a reload. The underline choice does not. The homepage hero still mounts.

### R19. Architecture and authority diagram

Immediately after the six-agent table, and before Decision workflow, show the supplied diagram. Do not redraw it.

Acceptance:

- `public/images/architecture-authority.png` is a byte-for-byte copy of `design-input/architecture-authority.png`, and the production build emits `dist/images/architecture-authority.png`.
- The case-study HTML references the image with the root-absolute path `/images/architecture-authority.png`.
- The image is inside a semantic `<figure>` under the heading “Architecture and authority”.
- A short introduction states that solid cyan marks evidence and artefact flow, dashed amber marks bounded review and revision, and green marks human authority only, matching the diagram legend.
- The alt text covers independent domain agents, structured findings, critical review, strategic synthesis, human decision ownership, and separately controlled execution.
- The caption is exactly: “Proposed architecture and authority design. Illustrative design study, not production telemetry or system output.”
- “Open full-size diagram” is a real link to `/images/architecture-authority.png`, at least 44px tall, using the existing focus style.
- The image uses `max-width: 100%` and `height: auto`, and the page does not scroll horizontally because of it.

### R20. A2A contract examples

Expand the existing A2A section from `design-input/A2A_CONTRACTS.md`. Copy payloads and schemas exactly. Do not add a syntax-highlighting dependency.

Acceptance:

- Three subsections, labelled DomainFinding, ReviewChallenge, and StrategicRecommendation, under the existing A2A heading. The page still has one H1.
- Each subsection explains that contract’s purpose in two or three sentences taken from the source, shows its illustrative JSON payload in a `<pre><code>` block, and puts the complete JSON Schema in a native `<details>` element whose summary is “View JSON Schema”.
- The example-chain note uses the source wording: the challenge targets financial finding version 1, and the recommendation references revised version 2.
- A “Validation and authority” summary covers exact contract-version validation, authenticated producer identity, decision-brief and correlation checks, allow-listed evidence resolution, immutable finding revisions, a maximum of three review rounds, required domain coverage and visible disagreement, and separate human approval with independent execution-gateway enforcement.
- The summary states that schema validation alone is not the security boundary, and does not claim the contracts are implemented or that human approval or execution has occurred.
- Code blocks scroll horizontally inside themselves: `pre { overflow-x: auto; max-width: 100%; }`.

### R21. Complete specification download

Acceptance:

- `public/downloads/A2A_CONTRACTS.md` matches `design-input/A2A_CONTRACTS.md` byte-for-byte, including every schema, payload, the 25 validation rules, and the acceptance tests.
- The production build emits `dist/downloads/A2A_CONTRACTS.md`.
- A visible link reads “Download the complete A2A contract specification” and points at `/downloads/A2A_CONTRACTS.md`.

### R22. Illustrative design-study status

Acceptance:

- “Architecture and design study” stays visible.
- The canonical URL stays exactly `https://ai.mileswaite.net/work/decision-intelligence/`.
- The page does not claim that the contracts are implemented, that the payloads are real system outputs, that the German-market scenario is real market research, that human approval or controlled execution has occurred, or that benchmark results or customer evidence exist.

### R23. Responsive and accessible contract presentation

Acceptance:

- At 375, 768, 1024, and 1440 CSS pixels the case-study page has no page-level horizontal overflow.
- The diagram stays proportionally scaled, and the full-size link opens the PNG.
- Long JSON lines stay inside the code block’s own scroll container.
- The schema disclosures open from the keyboard.
- Links show a visible focus state.
- Heading order stays logical: one H1, then h2 and h3.

### R24. No case-study regressions

Acceptance:

- Header Work and Contact on the case-study page still go to `/#work` and `/#contact`.
- A direct load and a reload of `/work/decision-intelligence/` return the case study, not a 404.
- The diagram URL and the download URL return 200.
- `npm run build` exits 0.
- This work does not change `index.html`, `src/main.ts`, `src/hero.ts`, `src/cylinder.ts`, or `src/content.ts`.
- `package.json` gains no runtime dependency.
- Header, theme, and scroll rules already present in `src/style.css` stay in place. New CSS is limited to the case-study diagram and contract blocks.

## Scope exclusions

- Blog, CMS, database, authentication, backend, analytics
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
| R5 | Off-white `#f3f2ee`, ink `#1c1c1c`, muted `#5e5c57` (5.96:1), accent `#c41212` (5.45:1), 1px rules. Header underlines follow R6 | `src/style.css` | Pass. Accent contrast measured. Header red `#c41212` is 5.45:1 and header green `#0c6b2c` is 5.94:1 on `#f3f2ee` |
| R6 | Homepage anchors scroll to `#work` and `#contact`. Case-study header links go to `/#work` and `/#contact`. Header underlines are a per-load red or green in light theme and `#f3f2ee` in dark theme. The theme control is a fixed L/D button at the top-right | `src/main.ts`, `src/theme.ts`, `src/style.css`, `index.html`, `work/decision-intelligence/index.html` | Pass. Eight light homepage loads were red, green, red, red, red, green, green, red. Computed header colour was `rgb(196, 18, 18)` or `rgb(12, 107, 44)`. Body links stayed `rgb(196, 18, 18)`. Dark header colour was `rgb(243, 242, 238)` on a red load and on a green load. The control read D or L, was `position: fixed` at the top-right, 44px, outside the nav, and did not cover the name |
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
| R18 | Left-edge scroll line and a stored light/dark theme on both pages. Header underlines follow R6 when the theme changes. The scroll line does not | `src/scroll-progress.ts`, `src/theme.ts`, `src/style.css`, `index.html`, `work/decision-intelligence/index.html` | Pass. Light fill started `rgba(15, 15, 15, 0.98)` with no white. Dark fill started `rgba(255, 255, 255, 0.98)`. The line was hidden at 375 and visible at 1440. Overflow was 0 at 375 and 1440 on both pages. `miles-theme` was the only stored key. CSS and JS returned 200. No error overlay |
| R19 | Supplied architecture diagram after the agent table | `public/images/architecture-authority.png`, `work/decision-intelligence/index.html` | Pass. SHA-256 `368132c7042dfbc127a1f54b369131baa6064dbaa3c2dfa40ad889a61c92515c` matches the source, `public/images`, and `dist/images`. The figure uses `/images/architecture-authority.png`. Caption matches the required sentence. At 375 the image rendered 343×291 from 2880×2440. At 768, 1024, and 1440 it rendered 604×512. Both ratios are 1.18. “Open full-size diagram” was 44px tall and opened `http://127.0.0.1:4174/images/architecture-authority.png` (2880×2440). The PNG response was 200, `image/png`, 457154 bytes |
| R20 | Exact DomainFinding, ReviewChallenge, and StrategicRecommendation payloads and schemas | `work/decision-intelligence/index.html`, `design-input/A2A_CONTRACTS.md` | Pass. The six `<pre><code>` blocks match the three payloads and three schemas in `A2A_CONTRACTS.md`. The example-chain note is the source sentence. The validation summary covers the eight checks and says schema validation alone is not the security boundary. No syntax-highlighting dependency was added |
| R21 | Complete specification download | `public/downloads/A2A_CONTRACTS.md` | Pass. SHA-256 `806d5a397299620c5d4bafb212f62d1cd5b2bd7c287449edabb4a4fc3a2b2119` matches the source, `public/downloads`, and `dist/downloads`. Preview fetch of `/downloads/A2A_CONTRACTS.md` returned 200, `text/markdown`, 35588 bytes. The link text is “Download the complete A2A contract specification” and the href is `/downloads/A2A_CONTRACTS.md` |
| R22 | Design-study status and canonical URL preserved | `work/decision-intelligence/index.html` | Pass. The kicker read “Architecture and design study”. Canonical was `https://ai.mileswaite.net/work/decision-intelligence/`. One H1. The page says the examples are illustrative and that human approval or execution is not claimed |
| R23 | Responsive, keyboard-accessible diagram and contracts | `src/style.css`, `work/decision-intelligence/index.html` | Overflow, scaling, and focus passed. Keyboard default action was not confirmed. Document overflow was 0 at 375, 768, 1024, and 1440. At 375 each code block’s right edge was 359 while its own scroll width reached 1197. Heading order was one H1, then h2 and h3. Forced `:focus-visible` on Work was `2px solid rgb(196, 18, 18)` with a 3px offset. Every measured link was at least 44px tall. A click opened the first schema. Enter and Space reached the focused summary, but those events were untrusted, so the browser did not run the native toggle |
| R24 | Existing navigation, build, and homepage sources unchanged by this work | `package.json`, homepage sources | Pass. `npm run build` exited 0. Preview was `http://127.0.0.1:4174` because 4173 was already in use. Direct load and reload of `/work/decision-intelligence/` returned the case study, navigation status 200. Work and Contact hrefs were `/#work` and `/#contact`. Diagram, download, CSS, and JS returned 200. No resource status was 400 or higher. After reload the scroll line was mounted and the theme control read D. Runtime dependency remains `three@0.180.0`. `git diff` was empty for `src/hero.ts`, `src/cylinder.ts`, `src/content.ts`, and `package.json`. `index.html` and `src/main.ts` still show the pre-existing header diff and were not edited for this work |

## Implementation notes

- Homepage host: `app/page.tsx` dynamically imports `RotatingCylinderLinesR3F` (client only, after two animation frames). Sizing classes on that page run from 20rem to 36rem. This page uses a smaller square on purpose (R7) without changing camera or geometry.
- React Three Fiber’s canvas defaults `dpr` to `[1, 2]` and does not pause when off-screen. The cap is preserved. Pause, reduced motion, and fallback are new and required by R8.
- The homepage still has no `og:image` and no canonical link. The case-study page sets canonical and `og:url` to `https://ai.mileswaite.net/work/decision-intelligence/` and does not set `og:image`.
- Hero copy is centred with `text-align: center` on `.hero` only. The introduction measure is `min(36rem, 100%)`. Hero bottom padding is `1.75rem`. Engineering context is the next section, using the same left-aligned section rule as Selected Work.
- The case study is not generated from Markdown at build time. `CASE_STUDY.md` is the narrative source, and `work/decision-intelligence/index.html` is the page. The architecture diagram and the A2A specification are byte copies of `design-input/architecture-authority.png` and `design-input/A2A_CONTRACTS.md`, published at `/images/architecture-authority.png` and `/downloads/A2A_CONTRACTS.md`. Vite’s multi-page input emits the case-study file; `appType: 'mpa'` keeps a missing path from falling back to the homepage.
- Contact address is `waite.miles@proton.me`. The contact GitHub profile remains `https://github.com/Milesy1`. Project repositories use `https://github.com/WaiteM124/ap-automation`, `governed-agent-toolkit`, and `miles-rag`.
- Each page’s inline boot script sets `data-header-ink` to `red` or `green` with `Math.random() < 0.5`. That choice is not stored. The header underline colour is a literal on `html[data-header-ink]` and `html[data-theme='dark']`, marked important so the general `.link` accent cannot override it. Light theme uses `#c41212` or `#0c6b2c`. Dark theme uses `#f3f2ee`. The L/D control is `position: fixed` at the top-right and is not in the header row.
