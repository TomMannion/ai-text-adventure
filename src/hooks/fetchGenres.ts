const fetchGenres = async () => {
  // const genresPrompt = 'List 10 unique story genres for a text-based adventure game in this format 1.genre1, 2.genre2,...10.genre10';
  // const fetchedGenres = await chatGPTRequest(genresPrompt);
  // console.log(fetchedGenres);
  // const genres = fetchedGenres[0].split('\n').map((genre) => genre.replace(/^\d+\.\s*/, ''));
  const genres: string[] = [
      "Weird Western",
      "Dieselpunk",
      "Solarpunk",
      "Biopunk",
      "Mythpunk",
      "Nanopunk",
      "Clockpunk",
      "Gothic Sci-Fi",
      "Mystical Thriller",
      "Occult Mystery",
      "Urban Horror",
      "Dark Humor",
      "Cryptozoology",
      "Alien Invasion",
      "First Contact",
      "Haunted House",
      "Psychic",
      "Paranormal Investigation",
      "Murder Mystery",
      "Legal Thriller",
      "Medical Thriller",
      "Techno-Thriller",
      "Superhero Noir",
      "Antihero",
      "Folklore Adventure",
      "Arthurian Legend",
      "Nordic Mythology",
      "Greek Mythology",
      "Egyptian Mythology",
      "Atlantean Mythology",
      "Aztec Mythology",
      "Time Loop",
      "Parallel Universe",
      "Space Opera",
      "Planetary Romance",
      "Hard Science Fiction",
      "Soft Science Fiction",
      "Cyborg",
      "Mutant",
      "Genetic Engineering",
      "Post-human",
      "Transhumanism",
      "Mind Control",
      "Apocalyptic",
      "Prehistoric",
      "Colonial",
      "Ancient World",
      "Medieval",
      "Renaissance",
      "Victorian",
      "Regency",
      "Enlightenment",
      "World War",
      "Cold War",
      "Prohibition",
      "Gold Rush",
      "Industrial Revolution",
      "Court Intrigue",
      "Political Satire",
      "Space Colony",
      "Intergalactic Empire",
      "Lost World",
      "Mythical Creatures",
      "Dream World",
      "Virtual World",
      "Eldritch Horror",
      "Gothic Romance",
      "Love Triangle",
      "Forbidden Love",
      "Reincarnation Romance",
      "Amnesia",
      "Alternate Reality",
      "Maze",
      "Trapped",
      "Parallel World",
      "Chosen One",
      "Dark Prophecy",
      "Secret Society",
      "Lost Treasure",
      "Ancient Artifact",
      "Cursed Object",
      "Relic Hunter",
      "Gladiator",
      "Viking",
      "Samurai",
      "Ninja",
      "Knight",
      "Monster Hunter",
      "Supernatural Detective",
      "Occult Detective",
      "Ghosts and Revenants",
      "Voodoo and Hoodoo",
      "Sea Monsters",
      "Haunted Objects",
      "Unsolved Mystery",
      "Supernatural Creatures",
      "Historical Fantasy",
      "Gaslamp Fantasy",
    ];
    
  
  return genres;
};

export default fetchGenres;