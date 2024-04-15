// APIKeyInput.tsx
import React, { useState, useContext } from "react";
import "./APIKeyInput.css";
import { AppContext } from "../AppContext";

const APIKeyInput: React.FC = () => {
  const { state, setState } = useContext(AppContext);
  const [apiKey, setApiKey] = useState<string>("");
  const [provider, setProvider] = useState<string>("groq"); // Default provider set

  // List of providers available for selection
  const providers = [
    { id: "groq", name: "Groq" },
    { id: "chatgpt", name: "ChatGPT (OpenAI)" },
    // { id: "claud", name: "Claud" },
  ];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setState({ ...state, apiKey, provider, gameState: "genreSelection" });
  };

  return (
    <div className="api-wrapper">
      <h2>Enter your API key and choose your provider:</h2>
      <div className="api-container">
        <form onSubmit={handleSubmit} className="api-input">
          <input
            type="text"
            placeholder="API key"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            autoComplete="api-key"
            required
          />
          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
        </form>
        <p>
          This is all run in the browser so the API key is private; it is used
          to generate your own story.
        </p>
        <p>
          Get your API key from the provider's site, like{" "}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            Groq
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default APIKeyInput;
