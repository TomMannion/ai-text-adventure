// APIKeyInput.tsx
import React, { useState, useContext } from 'react';
import './APIKeyInput.css';
import { AppContext } from '../AppContext';

const APIKeyInput: React.FC = () => {
  const { state, setState } = useContext(AppContext);
  const [apiKey, setApiKey] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setState({ ...state, apiKey, gameState: 'genreSelection' });
  };

  return (
    <div className="api-wrapper">
      <h2>Enter your OpenAI API key:</h2>
      <div className="component-container">
        <form onSubmit={handleSubmit} className="api-input">
          <input
            type="text"
            placeholder="API key"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            autoComplete="api-key"
            required
          />
          <button type="submit">Submit</button>
        </form>
        <p>This is all run in the browser so the api key is private, it is used to generate your own story.</p>
        <p>Get your API key from <a href="https://beta.openai.com/" target="_blank" rel="noopener noreferrer">OpenAI</a></p>
      </div>
    </div>
  );
};

export default APIKeyInput;
