// GameLoadOrCreate.tsx
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import MyStories from './MyStories';
import './GameLoadOrCreate.css';

const GameLoadOrCreate: React.FC = () => {
  const { setState } = useContext(AppContext);

  const handleCreate = () => {
    setState(prevState => ({ ...prevState, gameState: 'genreSelection' }));
  };

  return (
    <div className="center">
      <button className="game-button shine" onClick={handleCreate}>Start New Game</button>
      <MyStories />
    </div>
  );
};

export default GameLoadOrCreate;