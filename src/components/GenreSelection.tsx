import React, { FC } from 'react';
import './GenreSelection.css';

interface GenreSelectionProps {
  genres: string[];
  onGenreSelect: (genre: string) => void;
}

const GenreSelection: FC<GenreSelectionProps> = ({ genres, onGenreSelect }) => {
  return (
    <>
      <h2>Select a genre:</h2>
      <div className="genre-selection-container">
        {genres.map((genre, index) => (
          <button
            key={genre}
            onClick={() => onGenreSelect(genre)}
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


