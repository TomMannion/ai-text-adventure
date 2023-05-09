import React, { useEffect, useRef } from 'react';
import './GameOutput.css';
import Options from './Options';
import LoadingOverlay from './LoadingOverlay';

interface GameOutputProps {
  output: string[];
  genre: string;
  turnCount: number;
  isLoading: boolean;
  options: { [key: string]: string };
  handleOptionsClick: (optionText: string) => void;
}

const GameOutput: React.FC<GameOutputProps> = ({ output, genre, turnCount, isLoading, options, handleOptionsClick }) => {
  
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom element smoothly
    }
  }, [output]); // Run the effect whenever the output prop changes
  
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
      <div ref={bottomRef}></div> {/* Add the bottom element with the ref */}
      <LoadingOverlay show={isLoading} />
    </div>
  );
};

export default GameOutput;




