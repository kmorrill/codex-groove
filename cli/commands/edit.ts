import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Command } from 'commander';

export function registerEditCommand(program: Command): void {
  program
    .command('edit')
    .argument('<score>', 'Path to score JSON')
    .requiredOption('--patch <patch>', 'RFC6902 patch JSON file')
    .description('Apply a JSON patch to the score')
    .action(async (scorePath: string, options: { patch: string }) => {
      const target = resolve(scorePath);
      const patchPath = resolve(options.patch);
      const [scoreData, patchData] = await Promise.all([
        readFile(target, 'utf-8'),
        readFile(patchPath, 'utf-8')
      ]);
      // Patch application to be implemented later
      await writeFile(target, scoreData, 'utf-8');
      process.stdout.write(`Patched ${target} with ${patchPath} (noop placeholder)\n`);
    });
}
