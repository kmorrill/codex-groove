#!/usr/bin/env node
import { Command } from 'commander';
import { registerPlayCommand } from '../commands/play.js';
import { registerLiveCommand } from '../commands/live.js';
import { registerRenderCommand } from '../commands/render.js';
import { registerFetchCommand } from '../commands/fetch.js';
import { registerExplainCommand } from '../commands/explain.js';
import { registerEditCommand } from '../commands/edit.js';
import { registerEngineCommand } from '../commands/engine.js';
import { registerSetupCommand } from '../commands/setup.js';
import { registerUiCommand } from '../commands/ui.js';

const program = new Command();
program.name('vibe').description('Vibe Station CLI');

registerSetupCommand(program);
registerEngineCommand(program);
registerPlayCommand(program);
registerLiveCommand(program);
registerRenderCommand(program);
registerFetchCommand(program);
registerEditCommand(program);
registerExplainCommand(program);
registerUiCommand(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
