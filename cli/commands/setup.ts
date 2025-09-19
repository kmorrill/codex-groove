import type { Command } from 'commander';

export function registerSetupCommand(program: Command): void {
  program
    .command('setup')
    .description('Compile SynthDefs, write default config, and verify SuperCollider')
    .action(async () => {
      process.stdout.write('Setup routine not implemented yet.\n');
    });
}
