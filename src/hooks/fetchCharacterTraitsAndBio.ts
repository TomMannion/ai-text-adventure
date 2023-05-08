import chatGPTRequest from '../chatGPTRequest';
import dallERequest from '../dallE';
import processJson from '../utils/processJson';

interface CharacterData {
  characterTraits: string[];
  characterBio: string;
}

const fetchCharacterTraitsAndBio = async (chosenGenre: string, chosenCharacter: string, apiKey: string) => {
  const maxWords = 50;
  const characterTraitsAndBioPrompt = `
Based on the chosen genre "${chosenGenre}" and the character you are playing as "${chosenCharacter}", please provide a list of 5 character personality traits (a mixture of good and bad) in "characterTraits" and a short bio in no more than ${maxWords} words in "characterBio", the bio should not mention any specific locations or plans for the future.
Ensure you are outputting a JSON object with the following format:

{
  characterTraits: ["trait1", "trait2", "trait3", "trait4", "trait5"],
  characterBio: "back story"
}

`;

  const fetchedCharacterTraitsAndBio = await chatGPTRequest(characterTraitsAndBioPrompt, apiKey);
  const characterData: CharacterData = processJson<CharacterData>(fetchedCharacterTraitsAndBio[0]);

  console.log('Fetched characterData:', characterData);

  const characterImage = await dallERequest(
    characterData.characterTraits,
    chosenGenre,
    characterData.characterBio,
    chosenCharacter,
    apiKey
  );

  return {
    characterTraits: characterData.characterTraits,
    characterBio: characterData.characterBio,
    characterImage: characterImage
  };
};

export default fetchCharacterTraitsAndBio;