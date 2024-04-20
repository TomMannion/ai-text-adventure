// src/components/Options.tsx
import React from "react";
import "./Options.css";

interface Option {
  text: string;
}

interface OptionsProps {
  options: { [key: string]: Option };
  handleClick: (option: Option) => void; // Update the type here
}

const Options: React.FC<OptionsProps> = ({ options, handleClick }) => {
  return (
    <div className="options">
      {Object.entries(options).map(([optionKey, option]) => (
        <button
          onClick={() => handleClick(option)} // Pass the whole option object
          key={optionKey}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default Options;
