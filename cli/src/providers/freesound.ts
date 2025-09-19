export interface FreesoundSearchOptions {
  query: string;
  license?: 'cc0' | 'cc-by' | 'cc-by-sa';
}

export interface FreesoundResult {
  id: string;
  name: string;
  url: string;
  preview: string;
  license: string;
}

export async function searchFreesound(_opts: FreesoundSearchOptions): Promise<FreesoundResult[]> {
  // Placeholder: integrate with Freesound API
  return [];
}
