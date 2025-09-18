import { EventEmitter } from 'node:events';
import type { Score, Track } from '../types/score.js';
import type { NoteEvent } from '../types/score.js';

export type AgentOperation =
  | { op: 'addTrack'; track: Track }
  | { op: 'removeTrack'; id: string }
  | { op: 'setParam'; path: string; value: unknown }
  | { op: 'setPattern'; id: string; pattern: string }
  | { op: 'addNotes'; id: string; notes: NoteEvent[] };

export interface AgentApi {
  editScore(path: string, ops: AgentOperation[]): Promise<Score>;
  fetchSamples(query: string, licenseFilter?: string): Promise<unknown>;
  render(scorePath: string, opts?: { stems?: boolean }): Promise<string>;
  explain(scorePath: string): Promise<string>;
  setScene(name: string): Promise<void>;
  setMacro(name: string, x: number, y: number): Promise<void>;
}

export class AgentApiImpl extends EventEmitter implements AgentApi {
  async editScore(_path: string, _ops: AgentOperation[]): Promise<Score> {
    throw new Error('editScore not implemented yet');
  }

  async fetchSamples(_query: string, _licenseFilter?: string): Promise<unknown> {
    throw new Error('fetchSamples not implemented yet');
  }

  async render(_scorePath: string, _opts?: { stems?: boolean }): Promise<string> {
    throw new Error('render not implemented yet');
  }

  async explain(_scorePath: string): Promise<string> {
    return 'Explain not implemented yet';
  }

  async setScene(_name: string): Promise<void> {
    this.emit('scene', _name);
  }

  async setMacro(_name: string, _x: number, _y: number): Promise<void> {
    this.emit('macro', { name: _name, x: _x, y: _y });
  }
}
