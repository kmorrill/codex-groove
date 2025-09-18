import type { Command } from 'commander';
import { SuperColliderEngine } from '../src/engine/supercollider.js';

export function registerEngineCommand(program: Command): void {
  program
    .command('engine')
    .description('Boot SuperCollider + SuperDirt and load SynthDefs')
    .action(async () => {
      const engine = new SuperColliderEngine();
      await engine.boot();
      process.stdout.write('Engine boot placeholder complete\n');
    });
}
