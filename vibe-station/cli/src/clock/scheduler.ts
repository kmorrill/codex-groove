import { EventEmitter } from 'node:events';

export interface SchedulerOptions {
  bpm: number;
  lookAheadMs: number;
  tickMs?: number;
}

export interface ScheduledEvent {
  time: number;
  payload: unknown;
}

export class Scheduler extends EventEmitter {
  private readonly lookAhead: number;
  private readonly tick: number;
  private interval?: NodeJS.Timeout;
  private nextTime: number;

  constructor(private opts: SchedulerOptions) {
    super();
    this.lookAhead = opts.lookAheadMs / 1000;
    this.tick = (opts.tickMs ?? 25) / 1000;
    this.nextTime = process.hrtime.bigint ? Number(process.hrtime.bigint()) / 1e9 : Date.now() / 1000;
  }

  start(): void {
    if (this.interval) return;
    this.interval = setInterval(() => this.pump(), this.tick * 1000);
  }

  stop(): void {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = undefined;
  }

  schedule(event: ScheduledEvent): void {
    this.emit('schedule', event);
  }

  private pump(): void {
    const now = Date.now() / 1000;
    const horizon = now + this.lookAhead;
    this.emit('tick', { now, horizon });
    this.nextTime = horizon;
  }
}
