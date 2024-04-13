import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import './CharacterImageSelection.css';

const CharacterImageSelection: React.FC = () => {
  const { state, setState } = useContext(AppContext);  // Correct placement of useContext
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const characters = Array.from({ length: 33 }, (_, i) => `${i + 1}.webp`);

  const handleSelectCharacter = (character: string) => {
    setSelectedCharacter(character);
  };

  const handleSubmitCharacter = () => {
    setState({ ...state, chosenImage: `/characters/${selectedCharacter}`, gameState: 'characterSelection' });
  }

  return (
    <>
      <div className="submit-container">
        <button onClick={handleSubmitCharacter} className={'image-submit'}>Select Character Image</button>
      </div>
      <div className="character-image-selection-container">
        {characters.map((character, index) => (
          <button key={index} className={`character-image-button ${selectedCharacter === character ? 'selected' : ''}`}
                  onClick={() => handleSelectCharacter(character)}>
            <img src={`/characters/${character}`} alt={`Character ${index + 1}`} />
          </button>
        ))}
      </div>
    </>
  );
};

export default CharacterImageSelection;