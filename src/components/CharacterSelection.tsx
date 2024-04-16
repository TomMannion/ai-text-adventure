import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import "./CharacterSelection.css";

interface CharacterSelectionProps {
  firstNames: string[];
  lastNames: string[];
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  firstNames,
  lastNames,
}) => {
  const { state, setState } = useContext(AppContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRandomName = () => {
    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];

    // Differentiated syllable lists
    const startSyllables: string[] = [
      "Bel",
      "Nar",
      "Iv",
      "El",
      "Ar",
      "San",
      "Mar",
      "Jan",
      "Ad",
      "Or",
    ];
    const middleSyllables: string[] = [
      "der",
      "fal",
      "gorn",
      "hel",
      "mir",
      "ran",
      "las",
      "vin",
      "mel",
      "lor",
    ];
    const endSyllables: string[] = [
      "us",
      "ion",
      "or",
      "ix",
      "ax",
      "ith",
      "ath",
      "um",
      "ud",
      "old",
    ];

    // Example patterns: S = Start, M = Middle, E = End
    const patterns: string[] = [
      "SME",
      "SSME",
      "SMME",
      "SMMME",
      "SSE",
      "SM",
      "SE",
    ];

    const createNewName = (): string => {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      let newName = pattern
        .split("")
        .map((part) => {
          switch (part) {
            case "S":
              return startSyllables[
                Math.floor(Math.random() * startSyllables.length)
              ];
            case "M":
              return middleSyllables[
                Math.floor(Math.random() * middleSyllables.length)
              ];
            case "E":
              return endSyllables[
                Math.floor(Math.random() * endSyllables.length)
              ];
            default:
              return "";
          }
        })
        .join("");

      return newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase(); // Capitalize the first letter
    };

    const dynamicFirstName: string =
      Math.random() < 0.1 ? createNewName() : randomFirstName; // Adjust the probability as needed
    const dynamicLastName: string =
      Math.random() < 0.1 ? createNewName() : randomLastName; // Adjust the probability as needed

    setFirstName(dynamicFirstName);
    setLastName(dynamicLastName);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (firstName && lastName) {
      setState({
        ...state,
        chosenCharacter: `${firstName} ${lastName}`,
        gameState: "loading",
      });
    }
  };

  return (
    <div className="character-selection-wrapper">
      <h2>Select a character:</h2>
      <div className="character-selection-container">
        <p>Enter first and last name or generate a random name.</p>
        <form onSubmit={handleSubmit}>
          <div className="names-container">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleRandomName}>
            Random
          </button>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CharacterSelection;
