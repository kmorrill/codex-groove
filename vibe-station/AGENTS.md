# Agent Guide: vibe-station

This repo is built collaboratively between humans and the Codex coding agent. Keep the following guardrails in mind when writing code, running commands, or updating documentation.

## Mission

- Maintain a persistence-first JSON score format that stays diffable and easy for LLMs to modify.
- Orchestrate deterministic playback by scheduling OSC bundles to SuperCollider/SuperDirt.
- Provide a friendly, minimal surface for humans: CLI commands today, lightweight UI soon.
- Expose safe, well-typed entry points (JSON-RPC-ish) so other agents can request edits, renders, or explanations without raw file access.

## Environment notes

- Node.js >= 18.18 with pnpm 8.15.4 (installed globally via `npm install -g pnpm@8.15.4`). When the harness cannot locate pnpm, call `/Users/kevinmorrill/.asdf/installs/nodejs/.npm/bin/pnpm` directly.
- TypeScript project configured for `moduleResolution: NodeNext`. Prefer `tsx` for running source files.
- SuperCollider + SuperDirt run outside the harness. OSC messages should target UDP port **57120** (see `config/vibe.engine.json`).
- Never rely on relative paths when instructing humans to load the SuperCollider boot script; they need a full path inside their local checkout.

## Coding conventions

- Keep new files ASCII unless the domain demands otherwise.
- Document non-obvious logic with concise comments; avoid restating the code.
- Prefer functional, deterministic code. All scheduling must respect the configured look-ahead.
- Validate score mutations with AJV and the schema in `dsl/schema/vibe.schema.json`.
- When adding tests, favour Vitest.

## Operational checklist

1. Before editing, run `pnpm install` (root) and, if needed, `pnpm --filter vibe-station-ui install`.
2. Use the CLI entry `pnpm tsx cli/src/index.ts` during development; the published binary will live in `dist/` later.
3. After creating or editing SynthDefs, make sure the setup command compiles them into `engine/scsyndefs/`.
4. Ensure config defaults remain aligned with SuperDirt (ports, buffer counts, sample locations).
5. When modifying the JSON score format or schema, mirror the change in the TypeScript types and update sample scores.

## Collaboration etiquette

- Summaries go in README for humans; implementation details and extension plans belong in `AGENTS.md` or source comments.
- When instructing humans, give minimal but precise terminal commands; mention environment assumptions if paths differ.
- If SuperCollider configuration changes, update both humans (README) and agents (this file).
- Before handing over, run `pnpm run build` to confirm TypeScript still compiles.

## Next milestones

- Flesh out the SuperCollider engine to support look-ahead scheduling and true bar-aware reloads.
- Implement render pipeline (NRT to WAV + stems, FFmpeg loudnorm).
- Stand up WebSocket bridge + React UI with realtime feedback.
- Finish sample provider integrations and agent API surface.

Stay deterministic, keep the groove flowing.
