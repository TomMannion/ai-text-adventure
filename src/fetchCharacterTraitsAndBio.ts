import chatGPTRequest from './chatGPT';
import dallERequest from './dallE';

// const fetchCharacterTraitsAndBio = async (chosenGenre: string, chosenCharacter: string, gameWorld: string) => {
//   const maxWords = 60;
//   const characterTraitsAndBioPrompt = `
// Based on the chosen genre "${chosenGenre}" and chosen character "${chosenCharacter}" and generated game world "${gameWorld}", please provide a list of 5 character personality traits and a short, detailed bio in no more than ${maxWords} words for the main character in a text-based adventure game. Format the response as follows
// Personality traits:
// 1. {trait_1}
// 2. {trait_2}
// 3. {trait_3}
// 4. {trait_4}
// 5. {trait_5}
// Bio: {This is where you should write the short detailed bio for the main character.}
// `;
//   const fetchedCharacterTraitsAndBio = await chatGPTRequest(characterTraitsAndBioPrompt);
//   console.log(fetchedCharacterTraitsAndBio);
//   const characterTraitsAndBio = fetchedCharacterTraitsAndBio[0].split('\n');
//   const traits = characterTraitsAndBio.slice(1, 6).map((trait) => trait.replace(/^\d+\.\s*/, ''));
//   const bio = characterTraitsAndBio[7];

//   // also use this bio to generate an image of the character

//   const characterImage = await dallERequest(traits, chosenGenre, bio, chosenCharacter);

//   return { traits, bio, characterImage };
// };

// export default fetchCharacterTraitsAndBio;

const fetchCharacterTraitsAndBio = async (chosenGenre: string, chosenCharacter: string, gameWorld: string, apiKey: string) => {
  const maxWords = 50;
  const characterTraitsAndBioPrompt = `
Based on the chosen genre "${chosenGenre}" and the character you are playing as "${chosenCharacter}", please provide a list of 5 character personality traits and a short back story in no more than ${maxWords} words, the back story should not mention what the character plans to do next. Format the response as follows
Personality traits:
1. {trait_1}
2. {trait_2}
3. {trait_3}
4. {trait_4}
5. {trait_5}
Bio: {This is where you should write the short detailed bio for the main character.}
`;
const prompt2 = `
Based on the chosen genre "${chosenGenre}" and the character you are playing as "${chosenCharacter}", please provide a list of 5 character personality traits, a short back story in no more than ${maxWords} words, The back story should not mention what the character plans to do next.
Write a song using ToneJS with the following:
- Make it sound like the style of the ${chosenGenre} genre for a text based adventure game
- it does not need lyrics
- it does not need a description
- it should be able to loop towards the end so it can repeat seamlessly
- pick a bpm that you think is appropriate for the genre
- it should be at least 30 seconds long
- pick a key that you think is appropriate for the genre
- the format should be a string of notes and durations separated by commas with a hyphen between the note and the duration e.g. "C4-0.5, D4-0.5, E4-0.5, F4-0.5, G4-0.5, A4-0.5, B4-0.5, C5-0.5"

Format the response as follows:

Personality traits:
1. {trait_1}
2. {trait_2}
3. {trait_3}
4. {trait_4}
5. {trait_5}

Bio: {This is where you should write the short detailed bio for the main character.}

Melody: {This is where you should write the melody for the song.}

Bpm: {This is where you should write the bpm for the song.}

`
  const fetchedCharacterTraitsAndBio = await chatGPTRequest(prompt2, apiKey);
  console.log(fetchedCharacterTraitsAndBio);
  
  // Extract traits
  const traitsRegex = /^\d+\.\s*(.*)$/gm;
  const traits = [];
  let match;
  while (match = traitsRegex.exec(fetchedCharacterTraitsAndBio[0])) {
    traits.push(match[1]);
  }

  // Extract bio
  const bioRegex = /^Bio:\s*(.*)$/m;
  const bioMatch = bioRegex.exec(fetchedCharacterTraitsAndBio[0]);
  const bio = bioMatch ? bioMatch[1] : '';

  // Extract melody
  const melodyRegex = /^Melody:\s*(.*)$/m;
  const melodyMatch = melodyRegex.exec(fetchedCharacterTraitsAndBio[0]);
  const melodyString = melodyMatch ? melodyMatch[1] : '';

  // Convert melody string to an array of objects
  const melody = melodyString.split(',').map(note => {
    const [pitch, duration] = note.trim().split('-');
    return { pitch, duration: parseFloat(duration) };
  });

  // also use this bio to generate an image of the character
  const characterImage = await dallERequest(traits, chosenGenre, bio, chosenCharacter, apiKey);

  return { traits, bio, characterImage, melody};
};

export default fetchCharacterTraitsAndBio;
