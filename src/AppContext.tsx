import React, { createContext, useState, ReactNode } from "react";

type GameState =
  | "apiKeyInput"
  | "playing"
  | "characterImageSelection"
  | "characterSelection"
  | "loading"
  | "genreSelection"
  | "endingScreen"
  | "loadOrCreate";

type AppState = {
  gameState: GameState;
  genres: string[];
  characters: object;
  chosenGenre: string;
  chosenCharacter: string;
  characterTraits: string[];
  characterBio: string;
  characterGender: string;
  chosenImage: string;
  characterList: string;
  storyStart: string;
  storySummary: string[];
  options: { [key: string]: { text: string } };
  input: string;
  storySoFar: string[];
  storyAndUserInputs: string[];
  loadingProgress: number;
  turnCount: number;
  isLoading: boolean;
  isFinal: boolean;
  apiKey: string;
  provider: string;
  nextPartOfStory: string;
  previousParagraph: string;
  tempOptions: { [key: string]: string };
  charactersList: string;
  wrapUpParagraph: string;
  bigMoment: string;
  frequentActivity: string;
  characterTraitHighlight: string;
  themeExploration: string;
};

type AppContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const AppContext = createContext<AppContextType>({
  state: {
    gameState: "apiKeyInput",
    genres: [],
    characters: {},
    chosenGenre: "",
    chosenCharacter: "",
    characterTraits: [],
    characterBio: "",
    characterGender: "",
    chosenImage: "",
    characterList: "",
    storyStart: "",
    storySummary: [],
    options: {},
    input: "",
    storySoFar: [],
    storyAndUserInputs: [],
    loadingProgress: 0,
    turnCount: 0,
    isLoading: false,
    isFinal: false,
    apiKey: "",
    provider: "",
    nextPartOfStory: "",
    previousParagraph: "",
    tempOptions: {},
    charactersList: "",
    wrapUpParagraph: "",
    bigMoment: "",
    frequentActivity: "",
    characterTraitHighlight: "",
    themeExploration: "",
  },
  setState: () => null,
});

export type AppProviderProps = {
  children: ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    gameState: "apiKeyInput",
    genres: [],
    characters: {},
    chosenGenre: "",
    chosenCharacter: "",
    characterTraits: [],
    characterBio: "",
    characterGender: "",
    chosenImage: "",
    characterList: "",
    storyStart: "",
    storySummary: [],
    options: {},
    input: "",
    storySoFar: [],
    storyAndUserInputs: [],
    loadingProgress: 0,
    turnCount: 0,
    isLoading: false,
    isFinal: false,
    apiKey: "",
    provider: "",
    nextPartOfStory: "",
    previousParagraph: "",
    tempOptions: {},
    charactersList: "",
    wrapUpParagraph: "",
    bigMoment: "",
    frequentActivity: "",
    characterTraitHighlight: "",
    themeExploration: "",
  });
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
