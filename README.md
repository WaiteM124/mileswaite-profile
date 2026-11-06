# Miles Waite

A profile site. The homepage carries the cylinder from mileswaite.net, an engineering-context note, and selected work. The flagship case study is a second static page. The public origin is https://ai.mileswaite.net.

## Hero

Ported from `mileswaite.net/components/RotatingCylinderLinesR3F.tsx` (mounted by `app/page.tsx`).

That component draws three cylinders of Three.js line arcs — white, red, and green — on a black field, and rotates each arc about Y by a fixed step per frame. This project keeps that geometry, seed, colour, speed, camera (`z = 3.5`, fov 75), and tilt (`x = 0.5`, `z = 0.2`).

It does not use the older `components/RotatingCylinderLines.tsx` scene. That file uses a different camera, fog, and gap seed.

React and React Three Fiber are not included. `src/cylinder.ts` is the scene. `src/hero.ts` is the render loop, pixel-ratio cap, pause, reduced-motion still, WebGL fallback, and cleanup. The only runtime dependency is `three@0.180.0`, the version the reference site uses. `@types/three` is a dev dependency because that release does not ship its own types.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite prints a local URL. The page reloads when you edit a source file.

## Production build

```bash
npm run build
npm run preview
```

The preview serves the `dist` folder at http://127.0.0.1:4173.

## Edit the page

Change homepage copy, the engineering-context paragraphs, work items, and links in `src/content.ts`.

Engineering context sits between the hero and Selected Work. It is three short paragraphs: the enterprise risk and real-time background, floating maxima under opacity as a conceptual stress-testing approach, and the robust/antifragile distinction. Keep that section as text. Do not turn it into floating type, an opacity effect, or an animation.

The flagship summary stays as it is. Its only link is “Read the architecture and design case study”, pointing at `/work/decision-intelligence/`. Do not add a repository, demo, or results link until a real URL exists.

The case study is a static page at `work/decision-intelligence/index.html`. Its public path is `/work/decision-intelligence/` and its canonical URL is `https://ai.mileswaite.net/work/decision-intelligence/`. `CASE_STUDY.md` is the source text. When the study changes, update that file and transcribe the same wording into the HTML page. Keep the “Architecture and design study” label, and keep the illustrative recommendation labelled as structure rather than market research or performance results.

Header Work and Contact on the homepage scroll to `#work` and `#contact`. On the case-study page they point to `/#work` and `/#contact`.

The other three projects link to the WaiteM124 repositories in `src/content.ts`. Each of those entries is an explanation followed by an evaluation or architecture context. The header contact GitHub link is the separate profile at `https://github.com/Milesy1`.

The visible address is `waite.miles@proton.me`. It is set in `src/content.ts` and repeated in the `noscript` block in `index.html`.

Keep the homepage `<title>` and description in `index.html` aligned with the introduction. The homepage has no canonical link and no share image. The case-study page has a title, a description taken from the study dek, a canonical URL, and Open Graph title and description. Neither page has an `og:image`.

Do not add a font, icon package, or photograph. Colour and type live in `src/style.css`.

## Hero behaviour

- The drawing buffer uses `min(devicePixelRatio, 2)` so the lines stay sharp without a full-resolution retina buffer.
- The loop pauses when the square is off-screen or the tab is hidden, then starts again as a single loop.
- `prefers-reduced-motion: reduce` draws one frame and does not spin.
- If WebGL fails, the same arcs are drawn once as SVG. The square is not left empty.
- The animation is `aria-hidden`. The name, title, and introduction are HTML.
