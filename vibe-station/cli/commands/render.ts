import type { Command } from 'commander';
import { loadScore } from '../src/score/loader.js';
import { renderScore } from '../src/render/render.js';

export function registerRenderCommand(program: Command): void {
  program
    .command('render')
    .argument('<score>', 'Path to score JSON')
    .option('--stems', 'Render per-track stems')
    .description('Non-realtime render to WAV and stems')
    .action(async (scorePath: string, options: { stems?: boolean }) => {
      const score = await loadScore(scorePath);
      const outputDir = await renderScore(score, { stems: options.stems });
      process.stdout.write(`Rendered assets written to ${outputDir}\n`);
    });
}
