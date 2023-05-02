import React, { useState, useEffect } from 'react';
import './App.css';
import UserInput from './components/UserInput';
import GameOutput from './components/GameOutput';
import CharacterInfo from './components/CharacterInfo';
import GenreSelection from './components/GenreSelection';
import CharacterSelection from './components/CharacterSelection';
import LoadingBar from './components/LoadingBar';
import useFetchGameData from './useFetchGameData';
import fetchCharacters from './fetchCharacters';
import fetchGenres from './fetchGenres';
import fetchNextStoryPart from './fetchNextStoryPart';
import APIKeyInput from './components/APIKeyInput';


type GameState = 'apiKeyInput' | 'playing' | 'characterSelection' | 'loading' | 'genreSelection';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('apiKeyInput');
  const [genres, setGenres] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [chosenGenre, setChosenGenre] = useState<string>('');
  const [chosenCharacter, setChosenCharacter] = useState<string>('');
  const [storySoFar, setStorySoFar] = useState<string[]>([]);
  const [storyAndUserInputs, setStoryAndUserInputs] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');


  useEffect(() => {
    const fetchData = async () => {
      const genresData = await fetchGenres();
      setGenres(genresData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCharactersData = async () => {
      if (chosenGenre) {
        const charactersData = await fetchCharacters(chosenGenre);
        setCharacters(charactersData);
      }
    };

    fetchCharactersData();
  }, [chosenGenre]);

  const { gameWorld, characterTraits, characterBio, characterImage, storySummary, storyStart } = useFetchGameData(chosenGenre, chosenCharacter, apiKey);

  useEffect(() => {
    if (storyStart) {
      console.log('App storyStart:', storyStart);
      setStorySoFar([storySummary]);
      setStoryAndUserInputs([storyStart]);
      setGameState('playing');
    }
  }, [storyStart]);
  
  // useEffect to update the loading bar based on gameWorld, characterTraits, characterBio, characterImage and storyStart
  useEffect(() => {
    const loadingProgress = [gameWorld, characterTraits, characterBio, characterImage, storyStart].filter(Boolean).length * 20;
    setLoadingProgress(loadingProgress);
  }, [gameWorld, characterTraits, characterBio, characterImage, storyStart]);

  const handleAPIKeySubmit = (submittedApiKey: string) => {
    setApiKey(submittedApiKey);
    setGameState('genreSelection');
  };

  const handleGenreSelection = (input: string) => {
    setChosenGenre(input);
    setGameState('characterSelection');
  };

  const handleCharacterSelection = (input: string) => {
    setChosenCharacter(input);
    setGameState('loading');
  };

  const handleUserInput = async (input: string) => {
    // set the loading state to true
    setIsLoading(true);
    // use the fetchNextStoryPart function to get the next part of the story
    const { nextPart, summaryOfNextPart, storyStatus } = await fetchNextStoryPart(storySoFar.join(" - "), input, characterTraits, characterBio, gameWorld, apiKey);
    setStorySoFar([...storySoFar, summaryOfNextPart]);
    // add the user input to the story and user inputs array
    setStoryAndUserInputs([...storyAndUserInputs, input, nextPart]);
    // increment the turn count
    setIsLoading(false);
    setTurnCount(turnCount + 1);
    console.log("story and user input: " + storyAndUserInputs);
    // if the story is over, set the game state to genre selection
    if (storyStatus === 'completed') {
      setGameState('genreSelection');
    }
  };

  return (
    <div className="App">
      {gameState === 'apiKeyInput' && (
        <APIKeyInput onAPIKeySubmit={handleAPIKeySubmit} />
      )}
      {gameState === 'genreSelection' && (
        <GenreSelection genres={genres} onGenreSelect={handleGenreSelection} />
      )}
      {gameState === 'characterSelection' && (
        <CharacterSelection characters={characters} onCharacterSelect={handleCharacterSelection} />
      )}
      {gameState === 'loading' && (
        <LoadingBar progress={loadingProgress} />
      )}
      {gameState === 'playing' && (
        <div className="playing-container">
          <div className="game-and-user-input">
            <GameOutput output={storyAndUserInputs} genre={chosenGenre} turnCount={turnCount} isLoading={isLoading} />
            <UserInput handleSubmit={handleUserInput} />
          </div>
          <CharacterInfo characterName={chosenCharacter} characterTraits={characterTraits} characterBio={characterBio} characterImage={characterImage} />
        </div>
      )}
    </div>
  );
};

export default App;





