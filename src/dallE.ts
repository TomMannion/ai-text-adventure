// dallE.ts

import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/images/generations';
const dallERequest = async (chosenGenre: string, chosenCharacter: string, characterFacialFeatures: string[], apiKey: string, ): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const prompt = `Create a square portrait in a pixel art style (256x256 pixels) of a character's face. The character's name is ${chosenCharacter}, and key facial features are ${characterFacialFeatures.join(' ,')}. Make sure the character's face is the central focus of the image. The portrait should only show the character's face, with a solid black background and no other distractions or background elements.`;

  const body = {
    prompt: prompt,
    n: 1,
    size: "256x256",
  };

  const response = await axios.post(API_URL, body, { headers: headers });
  return response.data.data[0].url;
};

export default dallERequest;
