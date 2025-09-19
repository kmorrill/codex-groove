import type { Command } from 'commander';

export function registerUiCommand(program: Command): void {
  program
    .command('ui')
    .description('Serve the React UI and open the WebSocket bridge')
    .action(async () => {
      process.stdout.write('UI launch not implemented yet.\n');
    });
}
