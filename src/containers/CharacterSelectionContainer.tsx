import React, { useContext } from 'react';
import CharacterSelection from '../components/CharacterSelection';
import { AppContext } from '../AppContext';
import useFetchCharacters from '../hooks/useFetchCharacters';

const CharacterSelectionContainer: React.FC = () => {
  const { state } = useContext(AppContext);
  const { chosenGenre } = state;
  const { firstNames, lastNames } = useFetchCharacters(chosenGenre);

  return <CharacterSelection firstNames={firstNames} lastNames={lastNames} />;
};

export default CharacterSelectionContainer;
