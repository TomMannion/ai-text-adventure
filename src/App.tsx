// App.tsx
import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import ImageCarousel from "./components/CharacterImageSelection";
import APIKeyInput from "./components/APIKeyInput";
import GameOutput from "./components/GameOutput";
import CharacterInfo from "./components/CharacterInfo";
import LoadingBar from "./components/LoadingBar";
import GenreSelectionContainer from "./containers/GenreSelectionContainer";
import CharacterSelectionContainer from "./containers/CharacterSelectionContainer";
import useFetchGameData from "./hooks/useFetchGameData";
import { AppContext } from "./AppContext";
import useStoryProgress from "./hooks/useStoryProgress";
import EndingScreen from "./components/EndingScreen";
import GameLoadOrCreate from "./components/GameLoadOrCreate";
import { saveStoryToDB } from "./helpers/indexedDB";
import DroneComponent from "./components/DroneComponent";

const App: React.FC = () => {
  const { state } = useContext(AppContext);
  const {
    chosenGenre,
    chosenCharacter,
    characterTraits,
    characterBio,
    chosenImage,
    options,
    gameState,
    storySummary,
    storyAndUserInputs,
    turnCount,
    isLoading,
    isFinal,
    wrapUpParagraph,
    bigMoment,
    frequentActivity,
    characterTraitHighlight,
    themeExploration,
  } = state;

  useEffect(() => {
    if (gameState === "playing") {
      try {
        saveStoryToDB(state);
      } catch (error) {
        console.error("Failed to save game:", error);
      }
    }
  }, [state]);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useFetchGameData(setLoadingProgress);

  const handleUserInput = useStoryProgress();

  return (
    <div className="App">
      {gameState === "apiKeyInput" && (
        <div>
          <APIKeyInput />
        </div>
      )}
      {gameState === "loadOrCreate" && <GameLoadOrCreate />}
      {gameState === "genreSelection" && <GenreSelectionContainer />}
      {gameState === "characterSelection" && <CharacterSelectionContainer />}
      {gameState === "characterImageSelection" && (
        <div>
          <ImageCarousel />
        </div>
      )}
      {gameState === "loading" && <LoadingBar progress={loadingProgress} />}
      {gameState === "playing" && (
        <div className="playing-container">
          <div className="game-and-user-input">
            <GameOutput
              output={storyAndUserInputs}
              genre={chosenGenre}
              turnCount={turnCount}
              isLoading={isLoading}
              options={options}
              isFinal={isFinal}
              handleOptionsClick={handleUserInput}
            />
            {/* <MusicPlayer genre={'TraditionalHorror'} /> */}
          </div>
          <CharacterInfo
            characterName={chosenCharacter}
            characterTraits={characterTraits}
            characterBio={characterBio}
            characterImage={chosenImage}
          />
        </div>
      )}
      {gameState === "endingScreen" && (
        <EndingScreen
          characterImage={chosenImage}
          output={storyAndUserInputs}
          wrapUpParagraph={wrapUpParagraph}
          bigMoment={bigMoment}
          frequentActivity={frequentActivity}
          characterTraitHighlight={characterTraitHighlight}
          themeExploration={themeExploration}
        />
      )}
    </div>
  );
};

export default App;
