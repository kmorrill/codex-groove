import { EventEmitter, once } from 'node:events';
import type { Score, Track } from '../types/score.js';
import type { Engine, EngineStatus } from './types.js';
import { OscClient } from '../osc/osc.js';
import type { MetaArgument, OscMessage } from 'osc';
import { loadEngineConfig, type EngineConfig } from './config.js';
import debug from 'debug';

const log = debug('vibe:engine:supercollider');

interface PlaybackTimer {
  interval: NodeJS.Timeout;
  trackId: string;
}

export class SuperColliderEngine extends EventEmitter implements Engine {
  private status: EngineStatus = { playing: false, bar: 0, cpu: 0 };
  private oscClient?: OscClient;
  private config?: EngineConfig;
  private score?: Score;
  private timers: PlaybackTimer[] = [];
  private isBooted = false;
  private cycle = 0;

  constructor(private readonly options: { configPath?: string } = {}) {
    super();
  }

  async boot(): Promise<void> {
    this.config = await loadEngineConfig(this.options.configPath);
    this.oscClient = new OscClient({
      localPort: this.config.clientPort,
      remoteAddress: '127.0.0.1',
      remotePort: this.config.serverPort
    });

    await once(this.oscClient, 'ready');

    this.oscClient.on('message', (message: OscMessage) => {
      if (message.address === '/status.reply' && message.args) {
        const cpuArg = message.args.find((arg) => arg.type === 'f');
        if (cpuArg && typeof cpuArg.value === 'number') {
          this.status.cpu = cpuArg.value;
          this.emit('status', this.status);
          log('status: cpu=%d', cpuArg.value);
        }
      }
    });

    this.oscClient.on('error', (err) => {
      log('osc error: %s', err.message);
      this.emit('error', err);
    });

    this.ping();
    this.isBooted = true;
    log('booted with config %o', this.config);
  }

  async shutdown(): Promise<void> {
    this.stopTimers();
    this.oscClient?.close();
    this.oscClient = undefined;
    this.isBooted = false;
    log('shutdown complete');
  }

  async play(score: Score): Promise<void> {
    if (!this.isBooted || !this.oscClient) {
      throw new Error('SuperColliderEngine not booted');
    }

    this.stopTimers();
    this.score = score;
    this.status.playing = true;
    this.status.bar = 0;
    this.cycle = 0;

    const activeTracks = score.tracks.filter((track) => Boolean(track.pattern));
    activeTracks.forEach((track, index) => {
      this.startPatternLoop(track, index);
    });
    log('started playback for %d tracks', activeTracks.length);
  }

  async stop(): Promise<void> {
    this.status.playing = false;
    this.stopTimers();
    log('stopped playback');
  }

  async render(_score: Score, _opts: { stems?: boolean; commercial?: boolean }): Promise<string> {
    throw new Error('Render not implemented in MVP');
  }

  getStatus(): EngineStatus {
    return this.status;
  }

  private startPatternLoop(track: Track, orbit: number): void {
    if (!track.pattern || !this.score) return;
    const bpm = this.score.bpm;
    const pattern = track.pattern.replace(/\s+/g, '');
    if (!pattern.length) return;

    const beatDurationSeconds = 60 / bpm;
    const stepsPerBeat = 4;
    const stepDurationMs = (beatDurationSeconds / stepsPerBeat) * 1000;
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (!this.oscClient) return;
      const token = pattern[stepIndex % pattern.length];
      if (token && token.toLowerCase() === 'x') {
        this.triggerSuperDirt(track, orbit, beatDurationSeconds / stepsPerBeat);
      }
      stepIndex += 1;
    }, stepDurationMs);

    this.timers.push({ interval, trackId: track.id });
    log('track %s loop started (orbit %d, pattern %s)', track.id, orbit, track.pattern);
  }

  private triggerSuperDirt(track: Track, orbit: number, deltaSeconds: number): void {
    if (!this.oscClient) return;
    const instrument = this.resolveInstrument(track);
    const amplitude = this.dbToAmp(track.gain ?? 0);
    const cps = (this.score?.bpm ?? 120) / 60;
    this.cycle += deltaSeconds * cps;

    const args: MetaArgument[] = [
      { type: 's', value: 's' },
      { type: 's', value: instrument },
      { type: 's', value: 'sound' },
      { type: 's', value: instrument },
      { type: 's', value: 'orbit' },
      { type: 'f', value: orbit },
      { type: 's', value: 'delta' },
      { type: 'f', value: deltaSeconds },
      { type: 's', value: 'cps' },
      { type: 'f', value: cps },
      { type: 's', value: 'cycle' },
      { type: 'f', value: this.cycle },
      { type: 's', value: 'gain' },
      { type: 'f', value: amplitude },
      { type: 's', value: 'pan' },
      { type: 'f', value: 0 },
      { type: 's', value: 'begin' },
      { type: 'f', value: 0 },
      { type: 's', value: 'end' },
      { type: 'f', value: 1 }
    ];

    this.oscClient.send('/dirt/play', args);
    log('trigger track=%s instrument=%s orbit=%d', track.id, instrument, orbit);
  }

  private resolveInstrument(track: Track): string {
    if (track.type === 'sample') {
      const src = (track as { src?: string }).src;
      if (src) {
        const parts = src.split('/');
        const file = parts[parts.length - 1];
        const name = file.split('.')[0];
        return name;
      }
    }

    const engine = track.engine.toLowerCase();
    if (engine.includes('kick')) return 'bd';
    if (engine.includes('snare')) return 'sd';
    if (engine.includes('bass')) return 'bass';
    if (engine.includes('pad')) return 'pad';
    if (engine.includes('hat') || engine.includes('hh')) return 'hh';
    return engine;
  }

  private dbToAmp(db: number): number {
    return Math.pow(10, db / 20);
  }

  private stopTimers(): void {
    this.timers.forEach(({ interval }) => clearInterval(interval));
    this.timers = [];
  }

  private ping(): void {
    this.oscClient?.send('/status', []);
  }
}
