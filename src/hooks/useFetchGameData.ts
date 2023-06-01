import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import fetchCharacterTraitsAndBio from './fetchCharacterTraitsAndBio';
import { fetchStoryStart, fetchStorySummary } from './fetchStartOfStory';
import { getNextIdFromDB } from '../helpers/indexedDB';
import { saveStoryToDB } from '../helpers/indexedDB';

async function getBase64ImageFromURL(url: string): Promise<string> {
  const proxyUrl = 'https://cors-textai-image-server.herokuapp.com/proxy?url=' + encodeURIComponent(url);
  const response = await fetch(proxyUrl);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}

const useFetchGameData = (setLoadingProgress: (progress: number) => void) => {
  const { state, setState } = useContext(AppContext);
  const { chosenCharacter, chosenGenre, apiKey, storyStart } = state;

  useEffect(() => {
    const generateNewId = async () => {
      const newId = await getNextIdFromDB();
      setState(prevState => ({ ...prevState, id: newId }));
    };
  
    if (state.id === -1) { // Only generate a new ID if it's currently -1
      generateNewId();
    }
  }, [state.id, setState]);

  useEffect(() => {
    const fetchGameWorldAndCharacterInfo = async () => {
      if (chosenCharacter !== '' && storyStart === '') {
        const { characterTraits, characterBio, characterImage, characterGender } = await fetchCharacterTraitsAndBio(chosenGenre, chosenCharacter, apiKey);
        const base64Image = await getBase64ImageFromURL(characterImage);
        setState(prevState => ({ ...prevState, characterTraits, characterBio, characterImage: base64Image, characterGender }));
        const loadingProgress = [characterTraits, characterBio, characterImage].filter(Boolean).length * 25;
        setLoadingProgress(loadingProgress);

        const { storyStart, options } = await fetchStoryStart(chosenGenre, chosenCharacter, characterTraits, characterBio, characterGender, apiKey );
        const storySummary = await fetchStorySummary(storyStart, apiKey);
        console.log('Story summary: ' + storySummary);
        setState(prevState => ({ ...prevState, storyStart, previousParagraph: storyStart, storySummary: [storySummary], options, isLoading: false, storyAndUserInputs: [storyStart] }));
        setLoadingProgress(100);
      }
    };
    fetchGameWorldAndCharacterInfo();
  }, [chosenCharacter, setLoadingProgress, setState, apiKey, chosenGenre, storyStart]);

  useEffect(() => {
    if (storyStart !== '') {
      saveStoryToDB(state);
      setState(prevState => ({
        ...prevState,
        gameState: 'playing',
      }));
    }
  }, [storyStart, setState]);
};

export default useFetchGameData;


