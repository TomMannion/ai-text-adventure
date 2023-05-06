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
  const [options, setOptions] = useState<{ [key: string]: string }>({});
  const [melody, setMelody] = useState<{ pitch: string, duration: number }[]>([]);

  useEffect(() => {
    const fetchGameWorldAndCharacterInfo = async () => {
      if (chosenCharacter) {
        // const fetchedGameWorld: string = await fetchGameWorld(chosenGenre, chosenCharacter, apiKey);
        setGameWorld('');
  
        const { traits, bio, characterImage, melody } = await fetchCharacterTraitsAndBio(chosenGenre, chosenCharacter, gameWorld, apiKey);
        setCharacterTraits(traits);
        setCharacterBio(bio);
        setCharacterImage(characterImage);
        setMelody(melody);
        const { storyStart, storySummary, options } = await fetchStartOfStory(chosenCharacter, traits, bio, chosenGenre, apiKey);
        setStoryStart(storyStart);
        setStorySummary(storySummary);
        setOptions(options);
        console.log('Fetched storyStart:', storyStart);
        console.log('Fetched storySummary:', storySummary);
      }
    };
  
    fetchGameWorldAndCharacterInfo();
  }, [chosenCharacter]);
  

  return { gameWorld, characterTraits, characterBio, characterImage, storyStart, storySummary, options, melody };
};

export default useFetchGameData;
