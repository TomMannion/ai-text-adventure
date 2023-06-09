import React, { createContext, useState, ReactNode } from 'react';

type GameState = 'apiKeyInput' | 'playing' | 'characterSelection' | 'loading' | 'genreSelection';

type AppState = {
  gameState: GameState;
  genres: string[];
  characters: object;
  chosenGenre: string;
  chosenCharacter: string;
  characterTraits: string[];
  characterBio: string;
  characterGender: string;
  characterImage: string;
  characterList: string;
  storyStart: string;
  storySummary: string[];
  options: { [key: string]: { text: string; risk: string } };
  input: string;
  storySoFar: string[];
  storyAndUserInputs: string[];
  loadingProgress: number;
  turnCount: number;
  isLoading: boolean;
  apiKey: string;
  nextPartOfStory: string;
  previousParagraph: string;
  tempOptions: { [key: string]: string };
  charactersList: string;
};

type AppContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const AppContext = createContext<AppContextType>({
  state: {
    gameState: 'apiKeyInput',
    genres: [],
    characters: {},
    chosenGenre: '',
    chosenCharacter: '',
    characterTraits: [],
    characterBio: '',
    characterGender: '',
    characterImage: '',
    characterList: '',
    storyStart: '',
    storySummary: [],
    options: {},
    input: '',
    storySoFar: [],
    storyAndUserInputs: [],
    loadingProgress: 0,
    turnCount: 0,
    isLoading: false,
    apiKey: '',
    nextPartOfStory: '',
    previousParagraph: '',
    tempOptions: {},
    charactersList: '',
  },
  setState: () => null,
});

export type AppProviderProps = {
  children: ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    gameState: 'apiKeyInput',
    genres: [],
    characters: {},
    chosenGenre: '',
    chosenCharacter: '',
    characterTraits: [],
    characterBio: '',
    characterGender: '',
    characterImage: '',
    characterList: '',
    storyStart: '',
    storySummary: [],
    options: {},
    input: '',
    storySoFar: [],
    storyAndUserInputs: [],
    loadingProgress: 0,
    turnCount: 0,
    isLoading: false,
    apiKey: '',
    nextPartOfStory: '',
    previousParagraph: '',
    tempOptions: {},
    charactersList: '',
  });
  return <AppContext.Provider value={{ state, setState }}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
