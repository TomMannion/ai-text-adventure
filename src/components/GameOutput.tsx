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
      <div className="game-output-info">
        <p>Genre: {genre}</p>
        <p>Turns: {turnCount}</p>
        <p>{isLoading ? 'Loading response...' : ''}</p>
      </div>
      <div className="game-output-content">
        {output.map((text, index) => (
          <p key={index}>{text + '\n'}</p>
        ))}
      </div>
    </div>
  );
};

export default GameOutput;




