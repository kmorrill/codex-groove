import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface EngineConfig {
  serverPort: number;
  clientPort: number;
  wsPort: number;
  lookAheadMs: number;
  sampleRate: number;
  blockSize: number;
}

export async function loadEngineConfig(configPath = 'config/vibe.engine.json'): Promise<EngineConfig> {
  const fullPath = resolve(configPath);
  const data = await readFile(fullPath, 'utf-8');
  const config = JSON.parse(data) as EngineConfig;
  return config;
}
