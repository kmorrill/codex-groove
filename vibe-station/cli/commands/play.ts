import type { Command } from 'commander';
import { loadScore } from '../src/score/loader.js';
import { SuperColliderEngine } from '../src/engine/supercollider.js';

export function registerPlayCommand(program: Command): void {
  program
    .command('play')
    .argument('<score>', 'Path to score JSON')
    .option('--config <config>', 'Path to engine config JSON')
    .description('Schedule and play a score deterministically')
    .action(async (scorePath: string, options: { config?: string }) => {
      const score = await loadScore(scorePath);
      const engine = new SuperColliderEngine({ configPath: options.config });
      await engine.boot();
      await engine.play(score);

      process.stdout.write(`Playing ${score.metadata?.title ?? scorePath} — press Ctrl+C to stop.\n`);

      const shutdown = async () => {
        await engine.stop().catch(() => undefined);
        await engine.shutdown().catch(() => undefined);
        process.exit(0);
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    });
}
