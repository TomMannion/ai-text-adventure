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


  // storySummary: string[],
  // usersChoices: string[],

  const formatStorySummary = (storySummary: string[]): string => {
    let storySummaryFormatted = '';

    for (let i = 0; i < storySummary.length; i++) {
      if (i % 2 === 0) {
        storySummaryFormatted += `${i / 2 + 1} Story Segment: "${storySummary[i]}" - `;
      } else {
        storySummaryFormatted += `User's Choice: "${storySummary[i]}"\n`;
      }
    }

    return storySummaryFormatted;
}


  const prompt1 = `
  Please read this entire prompt before starting the task.
  You're an AI still writing our text-based adventure game. Remember, our main character is "${chosenCharacter}" who is ${characterGender}, in the genre "${chosenGenre}", with these quirks "${characterTraits.join('", "')}" and backstory "${characterBio}".
  This is a summary of the previous segments and user's choices: 
  ${formatStorySummary(storySummary.slice(-16))}
  read through this carefully as to no repeat senarios or options.
  Given the previous paragraph "${previousParagraph}", the user's action "${input.text}". create the next segment of the story (65-200 words). Make sure the story:
  - Continues logically from what's happened so far including the summary of previous segments and user's choices
  - When addressing the main character refer to them as "you" or "your"
  - Is unique and avoids clichés
  - Has detailed descriptions
  - Builds tension and suspense
  - Incorporates meaningful choices and consequences
  - Develops characters and their relationships
  - Balances action, dialogue, and description
  - Avoid clichés and overused tropes
  - Only incorporate characters quirks and backstory if they fit the current scene
  - Reaches a climax and completes the story arc when appropriate

  the user guides the story with their choices, so you must respect their choices even if they choose to make a bad decision.

  Now, Provide 3-5 game options that allow the player to keep exploring the story. Each option should be engaging, unique, and make sense within the story's progression and character's actions. Make sure each option fits the game's setting, leads to different story paths, and includes a risk level (low, medium, high). Include a "risky" option if possible.
  Try to make options specific and unique to the story or current scene, also avoid common tropes for creating options.

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

