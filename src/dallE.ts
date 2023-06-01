// dallE.ts

import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/images/generations';
const dallERequest = async (chosenGenre: string, chosenCharacter: string, dallePrompt: string, characterGender: string, apiKey: string, ): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const prompt = `${dallePrompt} as a profile picture, ${characterGender}, portrait, High-Resolution pixel art style.
  `;

  const prompt2 = `
  High-Resolution pixel art of a ${characterGender} character from the genre ${chosenGenre} as a profile picture. close up of the face. the character has ${dallePrompt}. style of Street Fighter II 1991.
  `

  const body = {
    prompt: dallePrompt,
    n: 1,
    size: "256x256",
  };

  const response = await axios.post(API_URL, body, { headers: headers });
  return response.data.data[0].url;
};

export default dallERequest;
