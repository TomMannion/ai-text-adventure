// src/types/story.ts

export type StoryStatus = 'completed' | 'died';

export interface StoryPart {
  storySegment: string;
  newStorySummary: string;
  storyStatus: StoryStatus;
  options: { [key: string]: { text: string, risk: string } };
}