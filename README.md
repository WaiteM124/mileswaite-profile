# Miles Waite

A one-page profile. The only moving part is the cylinder from the homepage of mileswaite.net.

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

Change copy, work items, and links in `src/content.ts`.

The flagship project has no link on purpose. Add one only when a real demo or repository URL exists.

The other three projects link to the WaiteM124 repositories in `src/content.ts`. The header contact GitHub link is the separate profile at `https://github.com/Milesy1`.

The visible address is `waite.miles@proton.me`. It is set in `src/content.ts` and repeated in the `noscript` block in `index.html`.

Keep the `<title>` and description in `index.html` aligned with the introduction. There is no share image and no canonical URL, because this project has no public origin and no bitmap assets.

Do not add a font, icon package, or photograph. Colour and type live in `src/style.css`.

## Hero behaviour

- The drawing buffer uses `min(devicePixelRatio, 2)` so the lines stay sharp without a full-resolution retina buffer.
- The loop pauses when the square is off-screen or the tab is hidden, then starts again as a single loop.
- `prefers-reduced-motion: reduce` draws one frame and does not spin.
- If WebGL fails, the same arcs are drawn once as SVG. The square is not left empty.
- The animation is `aria-hidden`. The name, title, and introduction are HTML.
