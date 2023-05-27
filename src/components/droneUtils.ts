// droneUtils.ts
import { scale } from '@tonaljs/scale';

export const getOscillatorType = (genre: string): string => {
  switch (genre) {
    case 'ambient':
      return 'sine';
    case 'dark':
      return 'triangle';
    default:
      return 'sine';
  }
};

export const getDroneNotes = (genre: string): string[] => {
  const scaleType = getScale(genre);
  const tonic = 'C3';
  const notes = scale('C2' + ' ' + 'phrygian').notes;
  return notes.slice(0, 3);
};

export const getScale = (genre: string): string => {
  switch (genre) {
    case 'ambient':
      return 'major';
    case 'dark':
      return 'phrygian';
    default:
      return 'major';
  }
};
