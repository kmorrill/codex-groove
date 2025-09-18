export interface ElevenLabsOptions {
  text: string;
  voiceId: string;
}

export interface ElevenLabsResult {
  id: string;
  path: string;
  license: string;
}

export async function generateWithElevenLabs(_opts: ElevenLabsOptions): Promise<ElevenLabsResult | null> {
  // Placeholder for TTS/audio generation API
  return null;
}
