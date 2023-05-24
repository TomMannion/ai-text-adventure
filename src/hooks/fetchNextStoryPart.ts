import chatGPTRequest from '../chatGPTRequest';
import processJson from '../utils/processJson';
import filterOptionsNew from '../utils/filterOptionsNew';

interface NextStoryPart {
  storySegment: string;
  options: { [key: string]: { text: string; risk: string } };
}

const fetchNextStoryPartAndOptions = async (
  storySummary: string[],
  previousParagraph: string,
  input: { text: string; risk: string },
  chosenCharacter: string,
  chosenGenre: string,
  characterTraits: string[],
  characterBio: string,
  characterGender: string,
  apiKey: string,
): Promise<NextStoryPart> => {

  const prompt1 = `
  Please read this entire prompt before starting the task.
  You're still writing our text-based adventure game. Remember, our main character is "${chosenCharacter}" who is ${characterGender}, in the genre "${chosenGenre}", with traits "${characterTraits.join('", "')}" and backstory "${characterBio}".
  This is a summary of the previous segments and user's choices "${storySummary.slice(-16).join(' - ')}" read through this carefully as to no repeat senarios or options.
  Given the previous paragraph "${previousParagraph}", the user's action "${input.text}". create the next segment of the story (65-200 words). Make sure the story:
  - Continues logically from what's happened so far including the summary of previous segments and user's choices
  - When addressing the main character refer to them as "you" or "your"
  - Is unique and avoids clichés
  - Has detailed descriptions
  - Builds tension and suspense
  - Incorporates meaningful choices and consequences
  - Develops characters and their relationships
  - Balances action, dialogue, and description
  - Reaches a climax and completes the story arc when appropriate

  Now, Provide 3-5 game options that allow the player to keep exploring the story. Each option should be engaging, unique, and make sense within the story's progression and character's actions. Make sure the options reflect the character's traits and backstory and offer opportunities for character development and exploration of genre themes.

  Strictly put your responses in this JSON format:
  {
    "storySegment": "{opening paragraph or scene, 65-200 words}",
    "options": {
      "option1": { 
        "text": "{option text, 10-30 words}",
        "risk": "{risk level, low, medium, high}",
      },
      // ... up to option5 in the same format
    }
  }

  `;

  let response;
  let responseObject: NextStoryPart = {
    storySegment: '',
    options: {},
  };
  let success = false;

  while (!success) {
    try {
      response = await chatGPTRequest(prompt1, apiKey);
      responseObject = processJson<NextStoryPart>(response[0]);

      // Filter options
      const filteredOptions = filterOptionsNew(responseObject.options);
      responseObject.options = filteredOptions;

      console.log('responseObject', responseObject);
      success = true;
    } catch (error) {
      console.error('Error processing response, retrying request...', error);
    }
  }

  return responseObject;
};

interface StorySummary {
  newStorySummary: string;
  storyStatus: string;
}

const fetchStorySummary = async (
  storySegment: string,
  apiKey: string,
): Promise<StorySummary> => {

  const prompt2 = `
  Write a concise summary of this story segment "${storySegment}" in one paragraph. The summary should include:
  - Character interactions (actions, dialogues, emotions, reactions)
  - Exact locations of characters and changes in location
  - Current inventory of each character (acquisition, usage, or loss of items)
  - Changes in character relationships (alliances, conflicts, interactions)
  - Key events or discoveries that affect the story or characters
  - Any other important details for narrative consistency and continuity

  also, provide the status of the story (ongoing, completed or died).

  Strictly put your responses in this JSON format:
  {
    "storySummary": "{summary of the story segment}",
    "storyStatus": "{status of the story, e.g., ongoing, completed}"
  }
  `;

  let response;
  let responseObject: StorySummary = {
    newStorySummary: '',
    storyStatus: '',
  };
  let success = false;

  while (!success) {
    try {
      response = await chatGPTRequest(prompt2, apiKey);
      responseObject = processJson<StorySummary>(response[0]);

      console.log('responseObject', responseObject);
      success = true;
    } catch (error) {
      console.error('Error processing response, retrying request...', error);
    }
  }

  return responseObject;
};

export { fetchNextStoryPartAndOptions, fetchStorySummary };

