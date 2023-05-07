import { useState, useEffect } from 'react';
import fetchGenres from './fetchGenres';

const useFetchGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const genresData = await fetchGenres();
      setGenres(genresData);
    };

    fetchData();
  }, []);

  return genres;
};

export default useFetchGenres;
