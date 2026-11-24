# ADR-002: Vite + TypeScript MPA with vanilla Three.js

**Status:** Accepted  
**Date:** 2026-11-06 (reconstructed from `README.md` and `REQUIREMENTS.md` highest-risk assumption / R1–R11)

---

## Context

The homepage hero on mileswaite.net is a React Three Fiber scene (`RotatingCylinderLinesR3F.tsx`): three nested cylinders of `THREE.Line` arcs on a black field. Porting the profile could have reused Next.js + React + R3F, or reimplemented the same geometry without that stack. The profile also needs a case-study page and later essay pages as real URLs, not a client-only SPA.

## Decision

1. Host the site as a **Vite multi-page application** with **TypeScript**.
2. Port the hero to **vanilla Three.js `0.180.0`** in `src/cylinder.ts` / `src/hero.ts` — no React, React Three Fiber, Next.js, Tailwind, or Framer Motion.
3. Keep homepage copy in `src/content.ts` and static HTML entries under `work/` and `writings/`, registered in `vite.config.ts` `build.rollupOptions.input`.

## Rationale

| Factor | Vanilla Three + Vite MPA | Next.js + R3F |
|---|---|---|
| Faithful geometry/seed/camera | Achievable with a direct port | Already exists on mileswaite.net |
| Runtime dependency weight | `three` only | React + R3F + framework |
| Extra pages (`/work/...`, `/writings/...`) | Real HTML entries in the MPA build | App Router routes |
| Reference project untouched | Profile is a separate repo | Risk of coupling |

`REQUIREMENTS.md` states the hero is not a shader and does not need `@react-three/drei`. Pause, reduced-motion still frame, SVG fallback, and disposal wrap the same scene without changing the arc maths.

## Consequences

- Contributors edit TypeScript and static HTML; there is no React component tree to learn for this site.
- New pages must be added to Vite’s `input` map or they will not appear in `dist/`.
- Three.js stays pinned at `0.180.0` to match the reference; bump only in a deliberate dependency PR.
- Accessibility and performance behaviour (pixel-ratio cap, off-screen pause, `prefers-reduced-motion`, SVG fallback) are owned in `src/hero.ts` and must be preserved when touching the hero.
