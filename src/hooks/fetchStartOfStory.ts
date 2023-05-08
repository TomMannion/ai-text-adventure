import chatGPTRequest from '../chatGPTRequest';
import processJson from '../utils/processJson';
import filterOptions from '../utils/filterOptions';

interface StartOfStory {
  storyStart: string;
  storySummary: string;
  options: { [key: string]: string };
}

const fetchStartOfStory = async (
  chosenGenre: string,
  chosenCharacter: string,
  characterTraits: string[],
  characterBio: string,
  apiKey: string
): Promise<StartOfStory> => {
  const prompt3 = `
  In the text-based adventure game, the user plays as ${chosenCharacter} in the ${chosenGenre} genre, with traits "${characterTraits.join('", "')}" and backstory "${characterBio}". Your task is to craft an engaging and compelling opening paragraph or scene (65-200 words) that sets the stage for the adventure and instantly grabs the reader's attention. Focus on:

  - Avoiding clichés
  - Writing captivating sentences
  - Using vivid language and sensory details
  - Building tension and suspense
  - Introducing meaningful choices and consequences
  - Presenting interesting characters and relationships
  - Balancing action, dialogue, and description
  - Incorporating twists, surprises, and subverted expectations
  
  Based on the opening paragraph or scene, provide the user with 3 to 5 options that naturally follow the story's beginning, offering ample opportunities for them to interact with the scene or explore the options. Ensure that each option is meaningful, consistent with the game's setting and character details, and leads to diverse story paths.
  
  Provide a concise summary (max 400 words) in "storySummary" that covers only the details present in the opening scene, including characters' interactions, locations, positions, actions, dialogues, relationships, and items. This summary should capture all important details and serve as a reference to build the next paragraph, without expanding the story beyond the opening scene.
  
  Output a JSON object with the following format:
  
  {
    storyStart: "{opening paragraph or scene, 65-200 words}",
    storySummary: "{summary, max 400 words}",
    options: {
      option1: "Option 1",
      option2: "Option 2",
      option3: "Option 3",
      option4: "Option 4, if applicable",
      option5: "Option 5, if applicable"
    }
  }
  
  `

  const response = await chatGPTRequest(prompt3, apiKey);
  const responseObject: StartOfStory = processJson<StartOfStory>(response[0]);

  // Filter options
  const filteredOptions = filterOptions(responseObject.options);
  responseObject.options = filteredOptions;

  return responseObject;
};

export default fetchStartOfStory;



