export interface LyriaOptions {
  prompt: string;
  durationSeconds?: number;
}

export interface LyriaResult {
  id: string;
  path: string;
  license: string;
}

export async function generateWithLyria(_opts: LyriaOptions): Promise<LyriaResult | null> {
  // Placeholder for model-based audio generation
  return null;
}
