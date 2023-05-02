import './CharacterInfo.css';
import React, { useState } from 'react';

interface CharacterInfoProps {
  characterName: string;
  characterTraits: string[];
  characterBio: string;
  characterImage: string;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ characterName, characterTraits, characterBio, characterImage }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={`character-info${showDetails ? " open" : ""} component-container`}>
      <img src={characterImage} alt={characterName} className="character-image" />
      <h3>{characterName}</h3>
      <button onClick={toggleDetails}>{showDetails ? "Hide Details" : "Show Details"}</button>
      <div className="character-details">
          <div className="traits-container">
            <h4>Traits</h4>
            <ul>
              {characterTraits.map((trait, index) => (
                <li key={index}>{trait}</li>
              ))}
            </ul>
          </div>
          <div className="bio-container">
            <h4>Character Bio</h4>
            <p>{characterBio}</p>
          </div>
      </div>
    </div>
  );
};

export default CharacterInfo;
