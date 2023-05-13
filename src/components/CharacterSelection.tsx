import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import './CharacterSelection.css';

interface CharacterSelectionProps {
  firstNames: string[];
  lastNames: string[];
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ firstNames, lastNames }) => {
  const { state, setState } = useContext(AppContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRandomName = () => {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    setFirstName(randomFirstName);
    setLastName(randomLastName);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (firstName && lastName) {
      setState({ ...state, chosenCharacter: `${firstName} ${lastName}`, gameState: 'loading' });
    }
  };

  return (
    <div className="character-selection-wrapper">
      <h2>Select a character:</h2>
      <div className="character-selection-container">
        <p>Enter first and last name or generate a random name.</p>
        <form onSubmit={handleSubmit}>
          <div className="names-container">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleRandomName}>Random</button>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CharacterSelection;


