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
Based on the chosen genre "${chosenGenre}" and the character you are playing as "${chosenCharacter}", please provide a list of 5 character personality traits, a short back story in no more than ${maxWords} words, and a song using ToneJS write a full song including intro, middle and ending, around 24 bars, they can however all be combined into one long string and do not need lyrics. make it sound like the style of the ${chosenGenre} genre for a text based adventure game. make it be able to loop towards the end so it can repeat seamlessly. The back story should not mention what the character plans to do next. Format the response as follows:

Personality traits:
1. {trait_1}
2. {trait_2}
3. {trait_3}
4. {trait_4}
5. {trait_5}

Bio: {This is where you should write the short detailed bio for the main character.}

Melody: {Use a format like e.g. "C4-1.0", where each note is followed by its duration this is just an example note and duration, you can use any note or duration for example 5.0 or even 0.01 or anything inbetween, separated by a dash and a comma. the whole song should be in here in one long string.}

`
  const fetchedCharacterTraitsAndBio = await chatGPTRequest(characterTraitsAndBioPrompt, apiKey);
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
  // const melodyRegex = /^Melody:\s*(.*)$/m;
  // const melodyMatch = melodyRegex.exec(fetchedCharacterTraitsAndBio[0]);
  // const melodyString = melodyMatch ? melodyMatch[1] : '';

  // // Convert melody string to an array of objects
  // const melody = melodyString.split(',').map(note => {
  //   const [pitch, duration] = note.trim().split('-');
  //   return { pitch, duration: parseFloat(duration) };
  // });

  // also use this bio to generate an image of the character
  const characterImage = await dallERequest(traits, chosenGenre, bio, chosenCharacter, apiKey);

  return { traits, bio, characterImage, melody: [] };
};

export default fetchCharacterTraitsAndBio;
