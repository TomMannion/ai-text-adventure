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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [output, isLoading]);

  console.log('GameOutput output:', output);
  return (
    <div className="game-output component-container">
      <div className="game-output-info">
        <p>Genre: {genre}</p>
        <p>Turns: {turnCount}</p>
      </div>
      <div className="game-output-content" ref={contentRef}>
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
    </div>
  );
};

export default GameOutput;