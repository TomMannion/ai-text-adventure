import chatGPTRequest from './chatGPTRequest';

const fetchGameWorld = async (chosenGenre: string, chosenCharacter: string, apiKey: string) => {
  const maxWords = 80;
  const gameWorldPrompt = `
Based on the chosen genre "${chosenGenre}" and the chosen characters name "${chosenCharacter}", please provide a detailed and immersive description of the game world for a text-based adventure game. The description should cover aspects such as the setting, the general atmosphere, and any unique features or locations in the game world.
Please format the description as a series of well-structured sentences in no more than ${maxWords} words that can be used in future prompts to create a rich and engaging game environment.
`;
  const fetchedGameWorld = await chatGPTRequest(gameWorldPrompt, apiKey);
  const gameWorld = fetchedGameWorld[0];
  return gameWorld;
};

export default fetchGameWorld;