import chatGPTRequest from "../chatGPTRequest";
import dallERequest from "../dallE";
import processJson from "../utils/processJson";

interface CharacterData {
  characterQuirks: string[];
  characterGender: string;
  characterBio: string;
  characterFacialFeatures: string[];
}

const fetchCharacterTraitsAndBio = async (
  chosenGenre: string,
  chosenCharacter: string,
  chosenImage: string,
  apiKey: string,
  provider: string
) => {
  const maxWords = 70;
  const characterTraitsAndBioPrompt = `
  Construct a detailed character profile for a text-adventure game based on the genre '${chosenGenre}' and the main character '${chosenCharacter}'. Include these three components:

  1. Five personality traits that display a mix of good and bad qualities. Consider various personalities from adventurous to mundane.
  2. a gender for the character, male, female, or non-binary.
  3. A short bio (up to ${maxWords} words) emphasizing the character's unique skills and abilities. Incorporate 2-4 abilities or skills, which may be exceptional talents, learned skills, or supernatural powers, depending on the genre. Avoid clichés by thinking of less commonly used character descriptions in the genre. Don't mention specific locations or future plans.
  4. Key visual facial features of the characters face, such as eye color, hair color, skin color, or other distinguishing or interesting features.
  
  For the chosen gender please always use the correct pronouns in the bio and quirks.
  Please output the information in the following JSON format:
  
  {
    "characterQuirks": ["quirk-1", ... "quirk-n]
    "gender": "specified gender",
    "characterBio": "detailed biography, max words 150",
    "characterFacialFeatures": ["feature1", "feature2", "feature3", "feature4", "feature5", ...]
  }
  
`;

  const fetchedCharacterTraitsAndBio = await chatGPTRequest(
    characterTraitsAndBioPrompt,
    apiKey,
    provider
  );
  const characterData: CharacterData = processJson<CharacterData>(
    fetchedCharacterTraitsAndBio[0]
  );

  // console.log("Fetched characterData:", characterData);

  // const characterImage = await dallERequest(
  //   chosenGenre,
  //   chosenCharacter,
  //   characterData.characterFacialFeatures,
  //   characterData.characterGender,
  //   apiKey
  // );

  return {
    characterTraits: characterData.characterQuirks,
    characterBio: characterData.characterBio,
    characterImage: chosenImage,
    characterGender: characterData.characterGender,
  };
};

export default fetchCharacterTraitsAndBio;
