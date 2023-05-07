import React, { useContext } from 'react';
import CharacterSelection from '../components/CharacterSelection';
import { AppContext } from '../AppContext';
import useFetchCharacters from '../hooks/useFetchCharacters';

const CharacterSelectionContainer: React.FC = () => {
  const { state } = useContext(AppContext);
  const { chosenGenre } = state;
  const characters = useFetchCharacters(chosenGenre);

  return <CharacterSelection characters={characters} />;
};

export default CharacterSelectionContainer;
