import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import AjvImport from 'ajv';
import addFormatsImport from 'ajv-formats';
import type { Score } from '../types/score.js';
import schema from '../../../dsl/schema/vibe.schema.json' with { type: 'json' };

const AjvConstructor = AjvImport as unknown as new (...args: any[]) => {
  compile<T>(schema: any): (data: unknown) => data is T & { errors?: unknown };
};

const addFormats = addFormatsImport as unknown as (ajv: any) => void;

const ajv = new AjvConstructor({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<Score>(schema as any) as ((data: unknown) => data is Score) & {
  errors?: { instancePath: string; message?: string }[];
};

export async function loadScore(path: string): Promise<Score> {
  const filePath = resolve(path);
  const data = await readFile(filePath, 'utf-8');
  const json = JSON.parse(data);
  if (!validate(json)) {
    const errors = (validate.errors ?? [])
      .map((err) => `${err.instancePath} ${err.message ?? ''}`.trim())
      .join('\n');
    throw new Error(`Score validation failed:\n${errors}`);
  }
  return json as Score;
}
