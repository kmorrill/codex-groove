import type { Score } from '../types/score.js';

export interface EngineContext {
  configPath: string;
}

export interface EngineStatus {
  playing: boolean;
  bar: number;
  cpu: number;
}

export interface Engine {
  boot(): Promise<void>;
  shutdown(): Promise<void>;
  play(score: Score): Promise<void>;
  stop(): Promise<void>;
  render(score: Score, opts: { stems?: boolean; commercial?: boolean }): Promise<string>;
  getStatus(): EngineStatus;
}
