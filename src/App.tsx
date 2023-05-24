// App.tsx
import React, { useState, useContext } from 'react';
import './App.css';
import APIKeyInput from './components/APIKeyInput';
import GameOutput from './components/GameOutput';
import CharacterInfo from './components/CharacterInfo';
import LoadingBar from './components/LoadingBar';
import GenreSelectionContainer from './containers/GenreSelectionContainer';
import CharacterSelectionContainer from './containers/CharacterSelectionContainer';
import useFetchGameData from './hooks/useFetchGameData';
import { AppContext } from './AppContext';
import useStoryProgress from './hooks/useStoryProgress';
import DroneComponent from './components/DroneComponent';

const App: React.FC = () => {
  const { state } = useContext(AppContext);
  const {
    chosenGenre,
    chosenCharacter,
    characterTraits,
    characterBio,
    characterImage,
    options,
    gameState,
    storyAndUserInputs,
    turnCount,
    isLoading,
  } = state;

  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useFetchGameData(setLoadingProgress);

  const handleUserInput = useStoryProgress();

  return (
    <div className="App">
      {gameState === 'apiKeyInput' && <div><APIKeyInput /></div>}
      {gameState === 'genreSelection' && <GenreSelectionContainer />}
      {gameState === 'characterSelection' && <CharacterSelectionContainer />}
      {gameState === 'loading' && <LoadingBar progress={loadingProgress} />}
      {gameState === 'playing' && (
        <div className="playing-container">
          <div className="game-and-user-input">
            <GameOutput
              output={storyAndUserInputs}
              genre={chosenGenre}
              turnCount={turnCount}
              isLoading={isLoading}
              options={options}
              handleOptionsClick={handleUserInput}
            />
            {/* <MusicPlayer genre={'TraditionalHorror'} /> */}
          </div>
          <CharacterInfo
            characterName={chosenCharacter}
            characterTraits={characterTraits}
            characterBio={characterBio}
            characterImage={characterImage}
          />
        </div>
      )}
    </div>
  );
};

export default App;