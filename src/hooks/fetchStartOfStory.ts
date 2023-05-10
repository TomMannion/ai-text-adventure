import chatGPTRequest from '../chatGPTRequest';
import processJson from '../utils/processJson';
import filterOptionsNew from '../utils/filterOptionsNew';

interface StartOfStory {
  storyStart: string;
  storySummary: string;
  options: { [key: string]: { text: string; risk: string } };
}

const fetchStartOfStory = async (
  chosenGenre: string,
  chosenCharacter: string,
  characterTraits: string[],
  characterBio: string,
  apiKey: string
): Promise<StartOfStory> => {
  const prompt3 = `
  In the text-based adventure game, the user plays as the main character: ${chosenCharacter}, in the text-adventure genre: ${chosenGenre}, with character traits: "${characterTraits.join('", "')}" and character bio: "${characterBio}". Your task is to craft an engaging and compelling opening paragraph or scene (65-200 words) that sets the stage for the adventure and instantly grabs the reader's attention. Focus on:

  - Avoiding clichés
  - Writing captivating sentences
  - Using vivid language and sensory details
  - Building tension and suspense
  - Introducing meaningful choices and consequences
  - Presenting interesting characters and relationships
  - Balancing action, dialogue, and description
  - Incorporating twists, surprises, and subverted expectations
  
  Based on the story segment, provide the user with 3 to 5 options in "options" that naturally follow the current part of the story, offering opportunities for them to interact with the scene or explore the options. Ensure that each option is meaningful, consistent with the game's setting and character details, and leads to diverse story paths.
  
  Provide a comprehensive summary of opening story segment to be created (max 45 words) in "storySummary" that precisely captures all crucial details from the current story segment, serving as a reference to build the next paragraph without expanding the story beyond the current segment. Ensure that the summary includes:

  - A detailed breakdown of character interactions, including actions, dialogues, emotions, and reactions
  - The exact locations of all characters, specifying their positions and any changes in location during the segment
  - The current inventory of items for each character, including the acquisition, usage, or loss of items
  - Any changes in the relationships between characters, such as alliances, conflicts, or other significant interactions
  - Key events, decisions, or discoveries that impact the direction of the story or the characters' motivations
  - Any other vital information required for maintaining continuity and consistency in the unfolding narrative
  
  Strictly only output a JSON object with the following format:
  
  {
    storyStart: "{opening paragraph or scene, 65-200 words}",
    storySummary: "{summary, max 45 words}",
    options: {
      option1: { 
        text: "{option text, 10-30 words}",
        risk: "{risk level, low, medium, high}",
      },
      option2: {
        text: "{option text, 10-30 words}",
        risk: "{risk level, low, medium, high}",
      },
      option3: {
        text: "{option text, 10-30 words}",
        risk: "{risk level, low, medium, high}",
      },
      option4: {
        text: "{option text, 10-30 words}",
        risk: "{risk level, low, medium, high}",
      },
      option5: {
        text: "{option text, 10-30 words}",
        risk: "{risk level, low, medium, high}",
      }
    }
  }

  `

  const response = await chatGPTRequest(prompt3, apiKey);
  const responseObject: StartOfStory = processJson<StartOfStory>(response[0]);

  // Filter options
  const filteredOptions = filterOptionsNew(responseObject.options);
  responseObject.options = filteredOptions;

  return responseObject;
};

export default fetchStartOfStory;



