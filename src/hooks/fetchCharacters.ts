const fetchCharacters = async (chosenGenre: string) => {
  // const charactersPrompt = `List 10 unique character names for a "${chosenGenre}" text-based adventure game:`;
  // const fetchedCharacters = await chatGPTRequest(charactersPrompt);
  // const characters = fetchedCharacters[0].split('\n').map((character) => character.replace(/^\d+\.\s*/, ''));
  const characters: string[] = [
    'Aria Stone',
    'Darius Blackwood',
    'Evelyn Thorn',
    'Felix Nightshade',
    'Gideon Ashcroft',
    'Harper Evergreen',
    'Iris Storm',
    'Jaxon Silver',
    'Kaiya Moonstone',
    'Lorenzo Firebrand',
    'Maeve Winterbourne',
    'Nikolai Shadow',
    'Ophelia Raven',
    'Percival Ironclad',
    'Quinn Ember',
    'Rowan Starlight',
    'Sage Whisperwind',
    'Talia Frost',
    'Ulysses Vanguard',
    'Vesper Marrow',
    'Winston Bladewalker',
    'Xander Hawke',
    'Yasmin Tempest',
    'Zara Sunforge',
    'Alistair Darkwater',
    'Bianca Stargazer',
    'Cassius Dreamweaver',
    'Daphne Sorrow',
    'Eamon Gale',
    'Faye Wraith',
    'Giovanni Lumen',
    'Helena Wildsong',
    'Ignatius Void',
    'Jasmine Shard',
    'Kendrick Rune',
    'Lilith Vex',
    'Magnus Stormrider',
    'Nadia Spectre',
    'Orion Mistfall',
    'Penelope Skyward',
  ];
  return characters;
};

export default fetchCharacters;
