import type { Command } from 'commander';

export function registerFetchCommand(program: Command): void {
  program
    .command('fetch')
    .requiredOption('--query <query>', 'Search query')
    .option('--cc0', 'Restrict to CC0 assets')
    .description('Search sample providers and update the local index')
    .action(async (options: { query: string; cc0?: boolean }) => {
      process.stdout.write(
        `Sample fetching not yet implemented (query: ${options.query}, license: ${options.cc0 ? 'cc0' : 'any'})\n`
      );
    });
}
