import type { Score, Track } from '../types/score.js';

export interface ScoreDiff {
  addedTracks: Track[];
  removedTrackIds: string[];
  updatedTracks: Track[];
}

export function diffScores(prev: Score, next: Score): ScoreDiff {
  const prevMap = new Map(prev.tracks.map((track) => [track.id, track]));
  const nextMap = new Map(next.tracks.map((track) => [track.id, track]));

  const addedTracks: Track[] = [];
  const removedTrackIds: string[] = [];
  const updatedTracks: Track[] = [];

  nextMap.forEach((track, id) => {
    if (!prevMap.has(id)) {
      addedTracks.push(track);
      return;
    }
    const prevTrack = prevMap.get(id);
    if (JSON.stringify(prevTrack) !== JSON.stringify(track)) {
      updatedTracks.push(track);
    }
  });

  prevMap.forEach((_track, id) => {
    if (!nextMap.has(id)) {
      removedTrackIds.push(id);
    }
  });

  return { addedTracks, removedTrackIds, updatedTracks };
}
