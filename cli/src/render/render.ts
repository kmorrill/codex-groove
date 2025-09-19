import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { formatISO } from 'date-fns';
import type { Score } from '../types/score.js';

export interface RenderOptions {
  stems?: boolean;
}

export async function renderScore(score: Score, opts: RenderOptions = {}): Promise<string> {
  const timestamp = formatISO(new Date()).replace(/[:]/g, '-');
  const title = score.metadata?.title ?? 'untitled';
  const outputDir = join('renders', title.replace(/\s+/g, '_'), timestamp);
  await mkdir(outputDir, { recursive: true });
  const placeholderPath = join(outputDir, 'mix.txt');
  const summary = [
    `Render placeholder for ${title}`,
    `BPM: ${score.bpm}`,
    `Stems: ${opts.stems ? 'yes' : 'no'}`
  ].join('\n');
  await writeFile(placeholderPath, summary, 'utf-8');
  return outputDir;
}
