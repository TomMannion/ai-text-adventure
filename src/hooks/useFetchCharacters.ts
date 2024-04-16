import { useState, useEffect } from "react";
import fetchCharacters from "./fetchCharacters";

const useFetchCharacters = (chosenGenre: string) => {
  const [firstNames, setFirstNames] = useState<string[]>([]);
  const [lastNames, setLastNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharactersData = async () => {
      if (chosenGenre !== "") {
        const { firstNames, lastNames } = await fetchCharacters();
        setFirstNames(firstNames);
        setLastNames(lastNames);
      }
    };
    fetchCharactersData();
  }, [chosenGenre]);

  return { firstNames, lastNames };
};

export default useFetchCharacters;
