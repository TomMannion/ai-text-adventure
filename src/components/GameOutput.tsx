import React, { useEffect, useRef } from 'react';
import './GameOutput.css';
import Options from './Options';
import LoadingOverlay from './LoadingOverlay';

interface Option {
  text: string;
  risk: string;
}

interface GameOutputProps {
  output: string[];
  genre: string;
  turnCount: number;
  isLoading: boolean;
  options: { [key: string]: { text: string, risk: string } };
  handleOptionsClick: (option: Option) => void;
}

const GameOutput: React.FC<GameOutputProps> = ({ output, genre, turnCount, isLoading, options, handleOptionsClick }) => {
  
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom element smoothly
    }
  }, [output, isLoading]); // Add isLoading dependency to the effect
  
  console.log('GameOutput output:', output);
  return (
    <div className="game-output component-container">
      <div className="game-output-info">
        <p>Genre: {genre}</p>
        <p>Turns: {turnCount}</p>
      </div>
      <div className="game-output-content">
        {output.map((text, index) => (
          <div key={index}>
            <p>{text + '\n'}</p>
            {index === output.length - 1 && !isLoading && (
              <Options
                options={options}
                handleClick={handleOptionsClick}
              />
            )}
          </div>
        ))}
      </div>
      <LoadingOverlay show={isLoading} />
      <div ref={bottomRef}></div> {/* Add the bottom element with the ref */}
    </div>
  );
};

export default GameOutput;




