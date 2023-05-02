// UserInput.tsx
import './UserInput.css';

import React, { useState } from 'react';

interface UserInputProps {
  handleSubmit: ((input: string) => void) | null;
}

const UserInput: React.FC<UserInputProps> = ({ handleSubmit }) => {
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleSubmit) {
      handleSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={onSubmit} className="component-container user-input">
      <input type="text" value={input} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserInput;

