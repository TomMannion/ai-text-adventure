import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import './GenreSelection.css';

interface GenreSelectionProps {
  genres: string[];
}

const GenreSelection: React.FC<GenreSelectionProps> = ({ genres }) => {
  const { state, setState } = useContext(AppContext);


  return (
    <>
      <h2>Select a genre:</h2>
      <div className="genre-selection-container">
        {genres.map((genre, index) => (
          <button
            key={genre}
            onClick={() => {
              setState({ ...state, chosenGenre: genre, gameState: 'characterSelection' });
            }}
            style={{ marginRight: index % 2 === 0 ? '0.5em' : '0', marginBottom: '0.5em' }}
          >
            {genre}
          </button>
        ))}
      </div>
    </>
  );
};

export default GenreSelection;



