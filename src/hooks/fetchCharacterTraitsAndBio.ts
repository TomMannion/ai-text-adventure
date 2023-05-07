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
Based on the chosen genre "${chosenGenre}" and the character you are playing as "${chosenCharacter}", please provide a list of 5 character personality traits and a short back story in no more than ${maxWords} words, the back story should not mention what the character plans to do next. Format the response as follows
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