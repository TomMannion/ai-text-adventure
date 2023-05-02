import chatGPTRequest from './chatGPT';

const fetchGenres = async () => {
  // const genresPrompt = 'List 10 unique story genres for a text-based adventure game in this format 1.genre1, 2.genre2,...10.genre10';
  // const fetchedGenres = await chatGPTRequest(genresPrompt);
  // console.log(fetchedGenres);
  // const genres = fetchedGenres[0].split('\n').map((genre) => genre.replace(/^\d+\.\s*/, ''));
  const genres: string[] = [
    'Fantasy',
    'Sci-Fi',
    'Mystery',
    'Horror',
    'Post-Apocalyptic',
    'Steampunk',
    'Cyberpunk',
    'Superhero',
    'Pirate',
    'Historical',
    'Espionage',
    'Western',
    'Romance',
    'Noir',
    'Gothic',
    'Survival',
    'Military',
    'Time Travel',
    'Virtual Reality',
    'Space Opera',
    'Urban Fantasy',
    'Paranormal',
    'Zombie Apocalypse',
    'Dystopian',
    'Alien Invasion',
    'Lovecraftian',
    'Mythology',
    'Fairy Tale',
    'Folklore',
    'Magical Realism',
    'Political Intrigue',
    'Crime',
    'Heist',
    'Dark Fantasy',
    'Alternate History',
    'Dieselpunk',
    'Techno-thriller',
    'Hard Sci-Fi',
    'Supernatural',
    'Vampire',
  ];
  return genres;
};

export default fetchGenres;