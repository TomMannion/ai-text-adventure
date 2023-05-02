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
  const maxWords = 60;
  const characterTraitsAndBioPrompt = `
Based on the chosen genre "${chosenGenre}" and chosen character "${chosenCharacter}" and generated game world "${gameWorld}", please provide a list of 5 character personality traits and a short, detailed bio in no more than ${maxWords} words for the main character in a text-based adventure game. Format the response as follows
Personality traits:
1. {trait_1}
2. {trait_2}
3. {trait_3}
4. {trait_4}
5. {trait_5}
Bio: {This is where you should write the short detailed bio for the main character.}
`;
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

  // also use this bio to generate an image of the character
  const characterImage = await dallERequest(traits, chosenGenre, bio, chosenCharacter, apiKey);

  return { traits, bio, characterImage };
};

export default fetchCharacterTraitsAndBio;
