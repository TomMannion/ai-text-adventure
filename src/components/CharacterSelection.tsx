import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import './CharacterSelection.css';


interface CharacterSelectionProps {
  characters: string[];
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ characters }) => {
  const { state, setState } = useContext(AppContext);
  return (
    <>
      <h2>Select a character:</h2>
      <div className="character-selection-container">
        {characters.map((character) => (
          <button key={character} onClick={() => { setState({ ...state, chosenCharacter: character, gameState: 'loading' }); }}>
            {character}
          </button>
        ))}
      </div>
    </>
  );
};

export default CharacterSelection;

