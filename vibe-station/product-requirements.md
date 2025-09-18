# vibe-station Product Requirements

_Last updated: 2024-09-18_

## Vision

Build **vibe-station**: a modern, file-first live-coding/co-writing music rig. Scores are persisted as JSON that humans and LLM agents can edit. Deterministic playback runs through SuperCollider + SuperDirt, driven by a TypeScript CLI that also bridges a playful React control surface.

## Goals

1. **Persistence-first authoring**
   - Canonical JSON score format (plus optional `.vibe` macros) that stays diffable in Git and friendly for LLM editing.
   - Stable IDs, explicit timing, and metadata to support collaborative editing.

2. **Deterministic playback**
   - Translate scores into OSC bundles with timetags for `scsynth`/SuperDirt.
   - Run SuperCollider headless (boot script in `engine/boot/boot.scd`).
   - Support hot-reload with minimal disruption (bar-aligned diffs).

3. **Minimal, playful UI**
   - React app exposing transport, BPM, swing, scene buttons, track mute/solo, and 1–3 macro XY pads via WebSocket messages.
   - No full DAW complexity; controls should feel performative and friendly.

4. **Samples + model adapters**
   - Manage CC-appropriate samples with provenance and license metadata.
   - Provide stubs/adapters for optional model-based audio generation (e.g., Lyria, ElevenLabs) invoked via tool scripts.

5. **Rendering**
   - Non-realtime bounce to WAV plus per-track stems, loudness normalized (ffmpeg).
   - Respect licensing guardrails (block non-commercial assets in `--commercial` renders).

6. **Agents & humans**
   - CLI commands for setup, live playback, rendering, sample fetch, score edits, explanations, and engine/UI control.
   - JSON-RPC-style agent API (`cli/src/agent/api.ts`) with safe functions: edit scores, fetch samples, render, explain, set scene/macro.
   - Validate edits against `dsl/schema/vibe.schema.json`.

## Key Decisions

- **Language**: TypeScript/Node for CLI, OSC scheduler, WebSocket bridge, React UI. Optional Python tooling lives under `tools/py/` (future work).
- **Audio backend**: SuperCollider + SuperDirt running headless; SynthDefs stored in `engine/synthdefs/` and compiled on setup.
- **Transport**: OSC/UDP to SuperCollider (`serverPort` default 57120), WebSocket (`wsPort` default 7777) for UI communication.
- **Lookahead**: ~120 ms (`lookAheadMs` in config) with NTP timetags.
- **Default Ports**:
  - `serverPort`: 57120 (SuperDirt)
  - `clientPort`: 57121 (CLI listens for status)
  - `wsPort`: 7777 (UI bridge)

## CLI Surface (initial)

```
vibe setup                          # compile SynthDefs, write defaults, verify SC + SuperDirt
vibe engine                         # boot sclang → scsynth, start SuperDirt, load defs
vibe play songs/foo.vibe.json       # deterministic playback
vibe live                           # watch score, hot-reload diffs on bar boundaries
vibe render <score> --stems         # NRT render → wav + stems + loudnorm
vibe fetch --query "vinyl crackle" --cc0   # sample search + index update
vibe edit --patch patch.json        # apply RFC6902 patch to score
vibe explain <score>                # NL summary of arrangement/tracks
vibe ui                             # serve React UI and open WS bridge
```

## UI ↔ CLI WebSocket Contract

- **UI → CLI** messages: transport (`play/pause/stop`), param changes (`bpm`, `swing`, `master.gain`, `tracks.<id>.<param>`), scene selection, track mute/solo, macro XY pad positions, render requests.
- **CLI → UI** messages: status (bar/cpu/playing), meters (master + per-track dB), available scenes.

## Acceptance Criteria

- `pnpm vibe setup && pnpm vibe engine && pnpm vibe play songs/first_groove.vibe.json` produces audible playback (Kick808 + Sawbass + sample via SuperDirt).
- Hot-reload updates playback on the next bar with no dropouts.
- UI connects over WS and transports/bpm/swing/scene/mute controls affect playback.
- Render command outputs normalized `mix.wav` and per-track stems to `renders/<title>/<timestamp>/`.
- Sample fetches track provenance and license metadata; block non-commercial assets when `--commercial` flag is set.

## Roadmap Highlights

- Implement lookahead-aware scheduler, diff-based live reloads, and agent-safe mutation APIs.
- Complete SuperCollider integration (synth compilation, sample loading, NRT render pipeline).
- Build the React UI with WebSocket bridge and shared TypeScript types for scores.
- Flesh out sample management, provider adapters, and licensing guardrails.
- Add testing (schema validation, scheduler math, command smoke tests).

These requirements capture the intent from the initial project brief and guide future development decisions.
