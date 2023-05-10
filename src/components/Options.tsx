import React from 'react';
import './Options.css';

interface OptionsProps {
  options: { [key: string]: { text: string, risk: string } };
  handleClick: (optionKey: string) => void;
}

const Options: React.FC<OptionsProps> = ({ options, handleClick }) => {
  return (
    <div className="options">
      {Object.entries(options).map(([optionKey, option]) => (
        <button
          onClick={() => handleClick(option.text)}
          key={optionKey}
        >
          {optionKey}: {option.text}
        </button>
      ))}
    </div>
  );
};

export default Options;