import type { Command } from 'commander';
import { loadScore } from '../src/score/loader.js';

export function registerExplainCommand(program: Command): void {
  program
    .command('explain')
    .argument('<score>', 'Path to score JSON')
    .description('Summarize arrangement and tracks in natural language')
    .action(async (scorePath: string) => {
      const score = await loadScore(scorePath);
      const tracks = score.tracks.map((track) => `- ${track.id} (${track.type})`).join('\n');
      const summary = [`Title: ${score.metadata?.title ?? 'Untitled'}`, `Tracks:\n${tracks}`].join('\n');
      process.stdout.write(`${summary}\n`);
    });
}
