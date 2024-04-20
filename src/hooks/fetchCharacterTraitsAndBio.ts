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
  Based on the parameters:
  - Character's Name: ${chosenCharacter}
  - Chosen Genre: ${chosenGenre}
  
  Generate character details for ${chosenCharacter}, a character in the genre ${chosenGenre}, ensuring that the quirks, bio, and traits align with their occupation and setting. These details should reflect a range of personalities, from humorously mundane if fitting (e.g., a grocery clerk on an unexpected adventure) to more traditionally heroic or notable (e.g., a hardened blacksmith or daring gunslinger). Include a modern understanding of gender inclusivity.
  
  1. Character Quirks: Create a list of quirks or traits. If the character's occupation or role suggests an ordinary or mundane life, these quirks should be humorously commonplace (e.g., "obsessively organizes cans by label color"). For more adventurous roles, the quirks should be distinctly bold or characteristic (e.g., "can forge a sword blindfolded").
  
  2. Gender: Assign a gender to the character that is inclusive, considering modern identities such as female, male, or non-binary.
  
  3. Character Bio: Write a concise biography of up to 80 words, reflecting the character's mundane or extraordinary background. The tone can range from comedic to serious, tailored to enhance the character's role and setting.
  
  4. Character Facial Features: List facial features that are distinctive and contribute to the character's visual identity. Features should be vivid and can include humorous or plain elements depending on the character’s overall tone.
  
  Output should be in the following JSON format:
  
  {
    "characterQuirks": ["quirk-1", "quirk-2", ... "quirk-n"],
    "gender": "specified gender",
    "characterBio": "Generated biography here.",
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
