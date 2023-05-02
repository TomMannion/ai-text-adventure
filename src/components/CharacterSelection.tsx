import React from 'react';
import './CharacterSelection.css';

interface CharacterSelectionProps {
  characters: string[];
  onCharacterSelect: (character: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ characters, onCharacterSelect }) => {
  return (
    <>
      <h2>Select a character:</h2>
      <div className="character-selection-container">
        {characters.map((character) => (
          <button key={character} onClick={() => onCharacterSelect(character)}>
            {character}
          </button>
        ))}
      </div>
    </>
  );
};

export default CharacterSelection;

