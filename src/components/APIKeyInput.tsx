// APIKeyInput.tsx
import React, { useState } from 'react';
import './APIKeyInput.css'

interface APIKeyInputProps {
  onAPIKeySubmit: (apiKey: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ onAPIKeySubmit }) => {
  const [apiKey, setApiKey] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAPIKeySubmit(apiKey);
  };

  return (
    <div className="api-wrapper">
      <h2>Enter your OpenAI API key:</h2>
      <form onSubmit={handleSubmit} className="component-container api-input">
        <input
          type="text"
          placeholder="API key"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <p>This is all run in the browser so the api key is private, it is used to generate your own story.</p>
      <p>Get your API key from <a href="https://beta.openai.com/" target="_blank" rel="noopener noreferrer">OpenAI</a></p>
    </div>
  );
};

export default APIKeyInput;