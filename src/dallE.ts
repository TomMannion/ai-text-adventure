// dallE.ts

import axios from "axios";

const API_URL = "https://api.openai.com/v1/images/generations";
const dallERequest = async (
  chosenGenre: string,
  chosenCharacter: string,
  characterFacialFeatures: string[],
  characterGender: string,
  apiKey: string
): Promise<string> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const prompt = `Create a square portrait (256x256 pixels) of a character's face in a pixel art style. Consider the following key details:

  - Characters gender: ${characterGender}
  - Characters Facial features: ${characterFacialFeatures.join(", ")}
  - Genre: ${chosenGenre}
  - Focus: The character's face should be the central focus of the image
  - Composition: The portrait should only show the character's face
  - Background: Use a solid black background with no distractions or other background elements
  
  Ensure the character portrait matches the environment they will be set in based on the genre provided.
  `;

  const prompt2 = `Create a pixel art portrait of a ${characterGender} character in the genre of ${chosenGenre}. The art should feature medium detail, capturing the essence of the style inspired by contemporary pixel artists like Octavi Navarro. The character should be set against a simple black background to enhance focus on the figure. the character has these details: ${characterFacialFeatures.join(
    ", "
  )}. The artwork should employ a dark and moody aesthetic, utilizing an artist-chosen color scheme to maximize creative expression. The lighting should be low, with heavy shadows to create a menacing and mysterious atmosphere. The overall mood should evoke a sense of eerie and dark allure typical of ${chosenGenre} visuals.`;

  const body = {
    prompt: prompt2,
    n: 1,
    size: "256x256",
  };

  const response = await axios.post(API_URL, body, { headers: headers });
  return response.data.data[0].url;
};

export default dallERequest;
