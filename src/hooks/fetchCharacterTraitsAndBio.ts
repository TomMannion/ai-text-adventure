import chatGPTRequest from "../chatGPTRequest";
import dallERequest from "../dallE";
import processJson from "../utils/processJson";

interface CharacterData {
  characterQuirks: string[];
  characterGender: string;
  characterBio: string;
  dallePrompt: string;
}

const fetchCharacterTraitsAndBio = async (
  chosenGenre: string,
  chosenCharacter: string,
  apiKey: string
) => {
  const maxWords = 70;
  const characterTraitsAndBioPrompt = `
  "You are a sophisticated AI specializing in generating diverse and intriguing characters for role-playing games. I require your expertise to create a unique character for me. This characters name is ${chosenCharacter}, and they will exist within a particular thematic world or genre, referred to as ${chosenGenre}.

  Please consider the character's environment, the challenges they might face, and the skills they would need to thrive in the genre "${chosenGenre}". Generate the following details:
  
  1. Unique character quirks that could add depth to my characters, try to avoid common tropes and think of unique out of the box quirks.
  2. A gender for the character. This can be male, female, or non-binary.
  3. A rich and immersive biography that provides insights into the character's past, their motivations, and their goals, the characters current job or role can either be mundane or exciting but try to stay away from common tropes, and focus on crafting a really unique and interesting backstory not seen before.
  4. A prompt to send to Dall-E to create a portrait-style image reminiscent of the character portraits in Street Fighter II start the prompt with 'A detailed pixel art portrait '. Focus on the character's face and include all important details visible above the shoulders, such as facial features and any hats. Avoid mentioning the character's name or any elements of the background scene. Always refer to the character by their gender. Conclude the request with 'in the pixel art style of Street Fighter II 1991, on a black background' to ensure the image is set against a black backdrop. The max words for the prompt is 45.
  

  For the chosen gender please always use the correct pronouns in the bio and quirks.
  Please output the information in the following JSON format:
  
  {
    "characterQuirks": ["quirk-1", ... "quirk-n]
    "gender": "specified gender",
    "characterBio": "detailed biography, max words 150",
    "dallePrompt": "prompt for dalle, max words 45"
  }"
  
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
    characterData.dallePrompt,
    characterData.characterGender,
    apiKey
  );

  return {
    characterTraits: characterData.characterQuirks,
    characterBio: characterData.characterBio,
    characterImage: characterImage,
    characterGender: characterData.characterGender,
  };
};

export default fetchCharacterTraitsAndBio;
