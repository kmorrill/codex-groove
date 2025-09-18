import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface SampleItem {
  id: string;
  path: string;
  source: string;
  license: string;
}

export interface SampleIndex {
  updatedAt: string | null;
  items: SampleItem[];
}

const INDEX_PATH = resolve('samples/index.json');

export async function readSampleIndex(): Promise<SampleIndex> {
  const data = await readFile(INDEX_PATH, 'utf-8');
  return JSON.parse(data) as SampleIndex;
}

export async function writeSampleIndex(index: SampleIndex): Promise<void> {
  const data = JSON.stringify(index, null, 2);
  await writeFile(INDEX_PATH, data, 'utf-8');
}
