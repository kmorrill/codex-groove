export interface NoteEvent {
  bar: number;
  step: number;
  len: string;
  midi: number;
  vel?: number;
}

export type TrackType = 'synth' | 'sample';

export interface TrackBase {
  id: string;
  type: TrackType;
  engine: string;
  pattern?: string;
  gain?: number;
}

export interface SynthTrack extends TrackBase {
  type: 'synth';
  notes?: NoteEvent[];
}

export interface SampleTrack extends TrackBase {
  type: 'sample';
  src: string;
  rate?: number;
}

export type Track = SynthTrack | SampleTrack;

export interface Scene {
  name: string;
  bars: [number, number];
  mutes?: string[];
}

export interface ScoreMetadata {
  title?: string;
  tags?: string[];
}

export interface Score {
  version: '0.2';
  bpm: number;
  swing?: number;
  scale?: string;
  clock?: {
    bars: number;
    ppq: number;
  };
  tracks: Track[];
  scenes?: Scene[];
  metadata?: ScoreMetadata;
}
