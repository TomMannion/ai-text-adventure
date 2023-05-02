// dallE.ts

import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/images/generations';
const dallERequest = async (traits: string[], chosenGenre: string, bio: string, chosenCharacter: string, apiKey: string): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const portraitPrompt = `
  create a portrait of a character in a text-based adventure game.
  The character is ${traits.join(', ')}.
  and the story genre is ${chosenGenre}.
  Ensure the characters face is clearly visible and the background, DO NOT INCLUDE ANY TEXT.
  `;

  const prompt = `Create a square portrait (256x256 pixels) of a character's face for a ${chosenGenre} text-based adventure game with a black background. The character's name is ${chosenCharacter}, and their traits are: ${traits.join(', ')}. The image should be detailed and realistic, with a focus on the character's facial features that represent their traits and genre. Ensure the image has no text in it.`;

  const body = {
    prompt: prompt,
    n: 1,
    size: "256x256",
  };

  const response = await axios.post(API_URL, body, { headers: headers });
  return response.data.data[0].url;
};

export default dallERequest;
