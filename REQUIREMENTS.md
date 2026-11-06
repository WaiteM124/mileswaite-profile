# Requirements

Living specification for the one-page profile at `mileswaite-profile`. The reference site at `mileswaite.net` is read-only.

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

Acceptance: those two anchors scroll to `#work` and `#contact`. No other navigation.

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
| Flagship: Autonomous Enterprise Decision Intelligence Platform | A multi-agent platform for investigating complex enterprise decisions. Specialist agents analyse independent business domains, critically review findings, and synthesise evidence into a structured recommendation for human decision-makers. | None |
| Self-Learning AP Automation | 71.5% automation at 99.47% accuracy across 11,118 invoice lines. | https://github.com/WaiteM124/ap-automation |
| Governed ERP Automation | 90+ tools operating against a live ERP under human-in-the-loop governance. | https://github.com/WaiteM124/governed-agent-toolkit |
| Enterprise RAG Assistant | 200+ users and 9.1/10 accuracy on a 500+ question golden dataset. | https://github.com/WaiteM124/miles-rag |

Acceptance: the flagship has no button or link. The other three hrefs match the table. The old `Meles123` and `Milesy1` repository URLs are not rendered.

### R10. Contact

Only these:

- https://www.linkedin.com/in/miles-waite-46628a3b2/
- https://github.com/Milesy1
- mailto:waite.miles@proton.me

Acceptance: no Instagram, no placeholder href, no dead button.

### R11. Light stack

Static page, Vite, TypeScript, and `three`. Content in one data file.

Acceptance: the only runtime dependency is `three@0.180.0`. Dev dependencies are Vite, TypeScript, and `@types/three` (three 0.180 does not ship its own types). No React, component library, icon package, font file, or bitmap.

### R12. Document and access

Acceptance:

- `<title>`, meta description, viewport, Open Graph title and description, and Twitter card title and description are present. No invented canonical URL or share image.
- Body text contrast is at least 4.5:1. Focus is visible. Every link’s box is at least 44×44px.
- No horizontal overflow at 375, 768, 1024, and 1440 CSS pixels.

### R13. Production build

Acceptance: `npm run build` exits 0.

### R14. Browser check

Acceptance: the production preview is opened in a browser. Desktop and mobile screenshots are reviewed. The console has no errors, unhandled rejections, or missing assets. Internal anchors, external hrefs, reduced motion, and pause/resume are exercised.

### R15. No deploy

Acceptance: nothing is deployed and the reference repo is not modified.

## Scope exclusions

- Blog, CMS, database, authentication, backend, analytics
- Dark mode, extra pages, project pages for the flagship
- Framer Motion entrance used on the old homepage
- The generative-sketch, p5, and non-homepage cylinder variants
- A time-corrected rewrite of the rotation speed
- Deployment, DNS, and a social preview image

## Traceability

| ID | Design decision | Location | Result |
| --- | --- | --- | --- |
| R1 | Vanilla port of the R3F homepage scene, same parameters and seed | `src/cylinder.ts`, `src/hero.ts` | Pass. 203 arcs. Running frames differ; the still matches the SVG fallback |
| R2 | No writes under `mileswaite.net` | — | Pass. This work did not edit the reference tree |
| R3 | New directory, workspace moved here | project root | Pass. `C:\Users\Miles\Desktop\Projects\mileswaite-profile` |
| R4 | Single living requirements file | `REQUIREMENTS.md` | Pass |
| R5 | Off-white `#f3f2ee`, ink `#1c1c1c`, muted `#5e5c57` (5.96:1), accent `#c41212` (5.45:1), 1px rules | `src/style.css` | Pass. Contrast measured. Screenshots show one accent and no cards |
| R6 | Two text anchors | `src/content.ts`, `src/main.ts` | Pass. Clicks landed on `#work` and `#contact` |
| R7 | Centred hero copy under the 17.5rem square. Intro measure `min(36rem, 100%)` with `text-wrap: balance`. Hero bottom padding `1.75rem` | `src/style.css` | Pass. Text centres match the animation. Desktop intro lines are 518px and 514px. At 375px the intro uses the full 343px column. Gap to Selected Work is 73px. Intro bottom is 550px at 1024×768 |
| R8 | One rAF loop, IO + visibility pause, DPR cap 2, SVG fallback, reduced-motion still | `src/hero.ts` | Pass. Paused off-screen and resumed running. Reduced-motion screenshots were byte-identical. Context loss replaced the canvas with 203 SVG arcs. DPR 2 produced a 560px buffer for the 280px box |
| R9 | Flagship has no link. The three repositories use the WaiteM124 URLs | `src/content.ts` | Pass. The rendered page links AP Automation, governed-agent-toolkit, and miles-rag to `github.com/WaiteM124`. The flagship has no link |
| R10 | Contact email is `mailto:waite.miles@proton.me` | `src/content.ts`, `index.html` | Pass. Visible text and href match. `googlemail` is absent from the source and the build |
| R11 | Vite + TS + three@0.180.0. `@types/three` is dev-only because 0.180 does not ship types | `package.json` | Pass. Production JS 483 kB (123 kB gzip), CSS 2.6 kB |
| R12 | Head tags in HTML; focus and 44px targets in CSS | `index.html`, `src/style.css` | Pass. Overflow 0 at 375, 768, 1024, and 1440. Every link box is at least 44px. The Proton link focus ring is 2px `#c41212` |
| R13 | `tsc --noEmit` then `vite build` | `package.json` | Pass. Exit 0 |
| R14 | Preview the `dist` build | — | Pass after the refinement. Console was empty. The hero paused off-screen, resumed as one loop, stayed still for reduced motion, and fell back to 203 SVG arcs |
| R15 | No deploy step | — | Pass. Nothing was deployed |

## Implementation notes

- Homepage host: `app/page.tsx` dynamically imports `RotatingCylinderLinesR3F` (client only, after two animation frames). Sizing classes on that page run from 20rem to 36rem. This page uses a smaller square on purpose (R7) without changing camera or geometry.
- React Three Fiber’s canvas defaults `dpr` to `[1, 2]` and does not pause when off-screen. The cap is preserved. Pause, reduced motion, and fallback are new and required by R8.
- Open Graph has no `og:image` and no `og:url` because no public origin or image asset was specified (R12, exclusions).
- Hero copy is centred with `text-align: center` on `.hero` only. The introduction measure is `min(36rem, 100%)`. Hero bottom padding is `1.75rem`, down from `3.25rem`, so the pause before Selected Work is shorter. Section padding is unchanged.
- Contact address is `waite.miles@proton.me`. The contact GitHub profile remains `https://github.com/Milesy1`. Project repositories use `https://github.com/WaiteM124/ap-automation`, `governed-agent-toolkit`, and `miles-rag`.
