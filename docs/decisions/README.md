# Architecture decision records

Short records of significant technical choices for [ai.mileswaite.net](https://ai.mileswaite.net).

## Format

Each record is a Markdown file named `ADR-NNN-short-title.md` with:

| Field | Meaning |
|---|---|
| **Status** | Proposed, Accepted, Superseded, or Deprecated |
| **Date** | When the decision was made (or reconstructed) |
| **Context** | The problem and constraints |
| **Decision** | What we chose |
| **Rationale** | Why, including alternatives considered |
| **Consequences** | Follow-on effects and watch-outs |

Keep records concise. Prefer reconstructing decisions from `README.md`, `REQUIREMENTS.md`, and deploy history over inventing new ones. When a decision changes, mark the old ADR Superseded and add a new record that links back.

## Index

| ADR | Title | Status |
|---|---|---|
| [ADR-001](ADR-001-vercel-hosting.md) | Host the profile on Vercel at ai.mileswaite.net | Accepted |
| [ADR-002](ADR-002-vite-vanilla-three.md) | Vite + TypeScript MPA with vanilla Three.js (no React) | Accepted |
