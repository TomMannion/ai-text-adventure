import { useEffect, useState } from 'react';
import fetchGameWorld from './fetchGameWorld';
import fetchCharacterTraitsAndBio from './fetchCharacterTraitsAndBio';
import fetchStartOfStory from './fetchStartOfStory';

const useFetchGameData = (chosenGenre: string, chosenCharacter: string, apiKey: string) => {
  const [gameWorld, setGameWorld] = useState<string>('');
  const [characterTraits, setCharacterTraits] = useState<string[]>([]);
  const [characterBio, setCharacterBio] = useState<string>('');
  const [storyStart, setStoryStart] = useState<string>('');
  const [storySummary, setStorySummary] = useState<string>('');
  const [characterImage, setCharacterImage] = useState<string>('');

  useEffect(() => {
    const fetchGameWorldAndCharacterInfo = async () => {
      if (chosenCharacter) {
        const fetchedGameWorld: string = await fetchGameWorld(chosenGenre, chosenCharacter, apiKey);
        setGameWorld(fetchedGameWorld);
  
        const { traits, bio, characterImage } = await fetchCharacterTraitsAndBio(chosenGenre, chosenCharacter, fetchedGameWorld, apiKey);
        setCharacterTraits(traits);
        setCharacterBio(bio);
        setCharacterImage(characterImage);

        const { storyStart, storySummary } = await fetchStartOfStory(traits, bio, fetchedGameWorld, apiKey);
        setStoryStart(storyStart);
        setStorySummary(storySummary);
        console.log('Fetched storyStart:', storyStart);
        console.log('Fetched storySummary:', storySummary);
      }
    };
  
    fetchGameWorldAndCharacterInfo();
  }, [chosenCharacter]);
  

  return { gameWorld, characterTraits, characterBio, characterImage, storyStart, storySummary };
};

export default useFetchGameData;
