import { useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import fetchCharacterTraitsAndBio from './fetchCharacterTraitsAndBio';
import fetchStartOfStory from './fetchStartOfStory';

const useFetchGameData = (setLoadingProgress: (progress: number) => void) => {
  const { state, setState } = useContext(AppContext);
  const { chosenCharacter, chosenGenre, apiKey, storyStart } = state;

  useEffect(() => {
    const fetchGameWorldAndCharacterInfo = async () => {
      if (chosenCharacter !== '' && storyStart === '') {
        const { characterTraits, characterBio, characterImage, characterGender } = await fetchCharacterTraitsAndBio(chosenGenre, chosenCharacter, apiKey);
        setState(prevState => ({ ...prevState, characterTraits, characterBio, characterImage, characterGender }));

        const loadingProgress = [characterTraits, characterBio, characterImage].filter(Boolean).length * 25;
        setLoadingProgress(loadingProgress);

        const { storyStart, storySummary, options } = await fetchStartOfStory(chosenGenre, chosenCharacter, characterTraits, characterBio, characterGender, apiKey );
        setState(prevState => ({ ...prevState, storyStart, storySummary: [storySummary], options, isLoading: false, storyAndUserInputs: [storyStart] }));
        setLoadingProgress(100);
      }
    };

    fetchGameWorldAndCharacterInfo();
  }, [chosenCharacter, setLoadingProgress, setState, apiKey, chosenGenre, storyStart]);

  useEffect(() => {
    if (storyStart !== '') {
      console.log('Game state:' + state);
      setState(prevState => ({
        ...prevState,
        gameState: 'playing',
      }));
    }
  }, [storyStart, setState]);
};

export default useFetchGameData;


