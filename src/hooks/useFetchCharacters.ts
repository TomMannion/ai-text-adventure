import { useState, useEffect } from 'react';
import fetchCharacters from './fetchCharacters';

const useFetchCharacters = (chosenGenre: string) => {
  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharactersData = async () => {
      if (chosenGenre !== '') {
        const charactersData = await fetchCharacters(chosenGenre);
        setCharacters(charactersData);
      }
    };
    fetchCharactersData();
  }, [chosenGenre]);

  return characters;
};

export default useFetchCharacters;