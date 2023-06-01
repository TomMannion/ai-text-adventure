// SaveGame.tsx

import React, { useContext } from 'react';
import { saveStoryToDB } from '../helpers/indexedDB';
import { AppContext } from '../AppContext';

const SaveGame: React.FC = () => {
  const { state } = useContext(AppContext);

  const handleSave = async () => {
    try {
      await saveStoryToDB(state);
      alert('Game saved!');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  return <button onClick={handleSave}>Save Game</button>;
};

export default SaveGame;
