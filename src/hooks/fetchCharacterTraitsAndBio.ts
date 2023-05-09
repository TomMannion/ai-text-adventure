import chatGPTRequest from "../chatGPTRequest";
import dallERequest from "../dallE";
import processJson from "../utils/processJson";

interface CharacterData {
  characterTraits: string[];
  characterBio: string;
}

const fetchCharacterTraitsAndBio = async (
  chosenGenre: string,
  chosenCharacter: string,
  apiKey: string
) => {
  const maxWords = 50;
  const characterTraitsAndBioPrompt = `
  Based on the text-adventure genre: "${chosenGenre}", and the main character you are playing: "${chosenCharacter}", please provide a list of 5 character personality traits in "characterTraits". These traits should be a creative mix of good and bad qualities, and consider a wide range of personalities from adventurous to mundane. For "characterBio", craft a short bio in no more than ${maxWords} words that showcases the character's unique background, experiences, and motivations. The bio should include elements from both exciting and ordinary life aspects but should not mention any specific locations or plans for the future.
Strictly only outputting a JSON object with the following format:

{
  characterTraits: ["trait1", "trait2", "trait3", "trait4", "trait5"],
  characterBio: "character bio"
}

`;

  const fetchedCharacterTraitsAndBio = await chatGPTRequest(
    characterTraitsAndBioPrompt,
    apiKey
  );
  const characterData: CharacterData = processJson<CharacterData>(
    fetchedCharacterTraitsAndBio[0]
  );

  console.log("Fetched characterData:", characterData);

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
    characterImage: characterImage,
  };
};

export default fetchCharacterTraitsAndBio;
