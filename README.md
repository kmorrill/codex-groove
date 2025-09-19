# vibe-station

_vibe-station_ is a persistence-first, SuperCollider-powered live coding and co-writing rig. Scores are JSON, playback is deterministic via OSC, and a playful React UI keeps performance controls accessible without diving into song internals.

## Features

- JSON score format designed for humans and agents.
- Deterministic SuperCollider + SuperDirt playback with lookahead scheduling.
- CLI for setup, live performance, rendering, and sample management.
- Lightweight React UI with transport, scene, and macro controls over WebSocket.
- Agent-friendly JSON-RPC-ish API for editing scores and managing assets.

## Getting Started

1. **Install prerequisites**
   - Node.js \>= 18.18 and pnpm \>= 8 (`asdf` users can run `npm install -g pnpm@8.15.4` and add `~/.asdf/installs/nodejs/.npm/bin` to `PATH`).
   - SuperCollider 3.13 with the SuperDirt and Dirt-Samples quarks installed.
   - ffmpeg (required later for loudness-normalized renders).
2. **Install dependencies**
   ```bash
   pnpm install
   pnpm --filter vibe-station-ui install   # optional: installs UI deps if using workspaces
   ```

## Minimal SuperCollider loop (MVP)

This proof-of-concept wires the JSON score to SuperDirt so edits in the score file retrigger playback.

1. **Start SuperDirt** in a SuperCollider session:
   ```supercollider
   (
   s.options.numBuffers = 4096;
   s.options.memSize = 2.pow(19);
   );

   "/Users/<you>/Documents/codex-groove/vibe-station/engine/boot/boot.scd".load;
   ```
   Wait for the post window to show `SuperDirt: listening on port 57120`.
2. **Run the live CLI** from another shell (updated config already targets 57120):
   ```bash
   export PATH="/Users/<you>/.asdf/installs/nodejs/.npm/bin:$PATH"   # if pnpm was installed via npm
   DEBUG=vibe:engine:* pnpm tsx cli/src/index.ts live songs/first_groove.vibe.json
   ```
3. **Edit the score** (e.g. change `pattern` strings) and save. The CLI watches the file, reschedules the groove, and SuperDirt reacts on the next tick.

The current MVP focuses on deterministic pattern playback. Hot-reload diffing, detailed engine control, rendering, UI feedback, and agent APIs remain to be implemented.

Refer to the project brief for detailed goals and architecture. Additional documentation will land alongside deeper CLI and UI implementations.
