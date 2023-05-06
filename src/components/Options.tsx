// Options.tsx
import React from 'react';
import './Options.css';

interface OptionsProps {
  options: { [key: string]: string };
  handleClick: (optionKey: string) => void;
}

const Options: React.FC<OptionsProps> = ({ options, handleClick }) => {
  return (
    <div className="options">
      {Object.entries(options).map(([optionKey, optionText]) => (
        <button
          onClick={() => handleClick(optionText)}
          key={optionKey}
        >
          {optionKey}: {optionText}
        </button>
      ))}
    </div>
  );
};

export default Options;