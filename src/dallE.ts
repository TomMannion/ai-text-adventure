// dallE.ts

import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/images/generations';
const dallERequest = async (chosenGenre: string, chosenCharacter: string, characterFacialFeatures: string[], characterGender: string, apiKey: string, ): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const prompt = `Create a square portrait (256x256 pixels) of a character's face in a pixel art style. Consider the following key details:

  - Characters gender: ${characterGender}
  - Characters Facial features: ${characterFacialFeatures.join(', ')}
  - Genre: ${chosenGenre}
  - Focus: The character's face should be the central focus of the image
  - Composition: The portrait should only show the character's face
  - Background: Use a solid black background with no distractions or other background elements
  
  Ensure the character portrait matches the environment they will be set in based on the genre provided.
  `;

  const prompt2 = `
  High-Resolution pixel art of a ${characterGender} character from the genre ${chosenGenre} as a profile picture. close up of the face. the character has ${characterFacialFeatures.join(', ')}. style of Street Fighter II 1991.
  `

  const body = {
    prompt: prompt2,
    n: 1,
    size: "256x256",
  };

  const response = await axios.post(API_URL, body, { headers: headers });
  return response.data.data[0].url;
};

export default dallERequest;
