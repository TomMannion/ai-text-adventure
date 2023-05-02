// GameOutput.tsx
import React from 'react';
import './GameOutput.css';

interface GameOutputProps {
  output: string[];
  genre: string;
  turnCount: number;
  isLoading: boolean;
}

const GameOutput: React.FC<GameOutputProps> = ({ output, genre, turnCount, isLoading }) => {
  console.log('GameOutput output:', output);
  return (
    <div className="game-output component-container">
      <p>Genre: {genre}</p>
      <p>Turns: {turnCount}</p>
      <p>{isLoading ? 'Loading response...' : ''}</p>
      {output.map((text, index) => (
        <p key={index}>{text + '\n'}</p>
      ))}
    </div>
  );
};

export default GameOutput;



