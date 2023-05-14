import chatGPTRequest from "../chatGPTRequest";
import dallERequest from "../dallE";
import processJson from "../utils/processJson";

interface CharacterData {
  characterTraits: string[];
  characterGender: string;
  characterBio: string;
  characterFacialFeatures: string[];
}

const fetchCharacterTraitsAndBio = async (
  chosenGenre: string,
  chosenCharacter: string,
  apiKey: string
) => {
  const maxWords = 70;
  const characterTraitsAndBioPrompt = `
  Construct a detailed character profile for a text-adventure game based on the genre '${chosenGenre}' and the main character '${chosenCharacter}'. Include these three components:

  1. Five personality traits that display a mix of good and bad qualities. Consider various personalities from adventurous to mundane.
  2. a gender for the character, male, female, or non-binary.
  3. A short bio (up to ${maxWords} words) emphasizing the character's unique skills, abilities. Incorporate 2-4 abilities or skills, which may be exceptional talents, learned skills, or supernatural powers, depending on the genre. Avoid clichés by thinking of less commonly used tropes in the genre and include both exciting and ordinary life aspects. Don't mention specific locations or future plans.
  4. Key visual facial features of the characters face, such as eye color, hair color, skin color, or other distinguishing or interesting features.
  
  Output a JSON object in this format:
  
  {
    "characterTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
    "gender": "male, female or non-binary",
    "characterBio": "character bio",
    "characterFacialFeatures": ["feature1", "feature2", "feature3", "feature4", "feature5", ...]
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
    chosenGenre,
    chosenCharacter,
    characterData.characterFacialFeatures,
    characterData.characterGender,
    apiKey
  );

  return {
    characterTraits: characterData.characterTraits,
    characterBio: characterData.characterBio,
    characterImage: characterImage,
    characterGender: characterData.characterGender,
  };
};

export default fetchCharacterTraitsAndBio;
