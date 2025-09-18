import type { Command } from 'commander';
import chokidar from 'chokidar';
import { loadScore } from '../src/score/loader.js';
import { SuperColliderEngine } from '../src/engine/supercollider.js';

export function registerLiveCommand(program: Command): void {
  program
    .command('live')
    .argument('<score>', 'Path to score JSON')
    .option('--config <config>', 'Path to engine config JSON')
    .description('Watch score file and hot-reload diffs on bar boundaries')
    .action(async (scorePath: string, options: { config?: string }) => {
      const engine = new SuperColliderEngine({ configPath: options.config });
      await engine.boot();
      let score = await loadScore(scorePath);
      await engine.play(score);

      process.stdout.write(`Live mode ready on ${scorePath}. Edit the file to hear updates. Ctrl+C to exit.\n`);

      const watcher = chokidar.watch(scorePath, { ignoreInitial: true });

      watcher.on('change', async () => {
        try {
          const updated = await loadScore(scorePath);
          score = updated;
          await engine.play(updated);
          process.stdout.write(`Reloaded score: ${new Date().toLocaleTimeString()}\n`);
        } catch (err) {
          process.stderr.write(`Failed to reload score: ${(err as Error).message}\n`);
        }
      });

      const shutdown = async () => {
        await engine.stop().catch(() => undefined);
        await engine.shutdown().catch(() => undefined);
        await watcher.close().catch(() => undefined);
        process.exit(0);
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    });
}
