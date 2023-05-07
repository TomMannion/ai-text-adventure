import React from 'react';
import GenreSelection from '../components/GenreSelection';
import useFetchGenres from '../hooks/useFetchGenres';

const GenreSelectionContainer: React.FC = () => {
  const genres = useFetchGenres();

  return <GenreSelection genres={genres} />;
};

export default GenreSelectionContainer;