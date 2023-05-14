import chatGPTRequest from '../chatGPTRequest';
import processJson from '../utils/processJson';
import filterOptionsNew from '../utils/filterOptionsNew';

interface NextStoryPart {
  storySegment: string;
  newStorySummary: string;
  storyStatus: string;
  options: { [key: string]: { text: string; risk: string } };
}

const fetchNextStoryPart = async (
  storySummary: string[],
  previousParagraph: string,
  input: { text: string; risk: string }, // Update the type of the function parameter
  chosenCharacter: string,
  chosenGenre: string,
  characterTraits: string[],
  characterBio: string,
  characterGender: string,
  apiKey: string,
): Promise<NextStoryPart> => {

  const prompt = `
  In the text-based adventure game, the user plays as the main character: "${chosenCharacter}", their gender is: ${characterGender}, in the text-adventure genre: ${chosenGenre}, with character traits: "${characterTraits.join('", "')}" and character bio: "${characterBio}".
  Your task is to craft an interesting next story segment (65-200 words) that follows the narrative established by the previous paragraph: "${previousParagraph}". Take into consideration the user's action based on the previous paragraph: "${input.text}", and the summary of previous segments and user's choices: "${storySummary.slice(-16).join(' - ')}". Focus on the following aspects:

  high (death chance +7%, max 80%), medium, low.
  - Punishment/reward chances based on risk: high (67%/33%), medium (47%/53%), low (25%/75%)
  - Maintaining consistency with the story so far
  - Avoiding clichés by utilizing lesser-known things in the genre
  - Provide detailed descriptions, especially for creatures or entities; give them a name or a vivid, varied description if not already mentioned, to prevent repetitiveness
  - try to not repeat similar story segments, try to make each segment unique and interesting
  - Weight up the users previous choices and segments and current choice based on the previous paragraph, if you deem the user's choice as risky it is your choice to punish (punishment can include death) them or give them a reward
  - Building tension and suspense
  - Developing meaningful choices and consequences
  - Expanding on interesting characters and relationships
  - Balancing action, dialogue, and description
  - Evaluating the summary of the previous segments and choices you should look for moments you can climax and complete the story arc when you deem it appropriate or kill off the character if you deem it appropriate.
  - the next segement should not contain the previous paragraph
  
  Based on the story segment, provide the user with 3 to 5 options in "options" that focus on:
  - Creating engaging, detailed, unique and interesting options
  - Avoiding clichés
  - Naturally following the current part of the story
  - has a mixture of positive and negative options
  - has a mixture of risky and safe options, giving the user room to gamble and take risks or not
  - Offering opportunities for them to interact with the scene
  - Ensure that each option is meaningful, consistent with the game's setting
  - leads to diverse story paths
  
  Provide a comprehensive summary of the new story segment to be created (max 45 words) in "newStorySummary" that precisely captures all crucial details from the segment, serving as a reference to build the next paragraph without expanding the story beyond the current segment. Ensure that the summary includes:

  - A detailed breakdown of character interactions, including actions, dialogues, emotions, relationships, and reactions
  - The exact locations of all characters, specifying their positions and any changes in location during the segment
  - The current inventory of items for each character, including the acquisition, usage, or loss of items
  - Any changes in the relationships between characters, such as alliances, conflicts, or other significant interactions
  - Key events, decisions, or discoveries that impact the direction of the story or the characters' motivations
  - Any other vital information required for maintaining continuity and consistency in the unfolding narrative
 
  Strictly use "storySegment", "newStorySummary", and "options" variables in the JSON object.

  Strictly only output a JSON object with the following format:
  
  {
    {
      "storyStart": "{opening paragraph or scene, 65-200 words}",
      "storySummary": "{summary, max 45 words}",
      "options": {
        "option1": { 
          "text": "{option text, 10-30 words}",
          "risk": "{risk level, low, medium, high}",
        },
        "option2": {
          "text": "{option text, 10-30 words}",
          "risk": "{risk level, low, medium, high}",
        },
        "option3": {
          "text": "{option text, 10-30 words}",
          "risk": "{risk level, low, medium, high}",
        },
        option4: {
          text: "{option text, 10-30 words}",
          risk: "{risk level, low, medium, high}",
        },
        option5: {
          "text": "{option text, 10-30 words}",
          "risk": "{risk level, low, medium, high}",
        }
      }
    }

  `

const prompt2 = `
Please read this entire prompt before starting the task.
Create a story segment (65-200 words) for a text-based adventure game with the main character "${chosenCharacter}" in the genre "${chosenGenre}". Use the character traits "${characterTraits.join('", "')}", character bio "${characterBio}", the previous paragraph "${previousParagraph}", and the user's action "${input.text}". Consider the summary of previous segments and user's choices "${storySummary.slice(-16).join(' - ')}". Focus on:

- Consistency with the story so far
- Avoiding clichés
- Detailed descriptions
- Unique and interesting segments
- User's previous choices and segments
- Tension and suspense
- Meaningful choices and consequences
- Character and relationship development
- Balancing action, dialogue, and description
- Climax and story arc completion when appropriate

Provide 3-5 options in "options" that are engaging, detailed, unique, and interesting. Ensure the options follow the story naturally and link the user's choices to the story's progression and the character's actions. Reflect the character's traits and bio, and offer opportunities for character development and exploration of the genre's themes.

Create a summary (max 45 words) in "newStorySummary" of the current story segment. Include:

- Character interactions (actions, dialogues, emotions, reactions)
- Character locations and position changes
- Character inventory (acquisition, usage, or loss of items)
- Relationship changes (alliances, conflicts, etc.)
- Key events, decisions, or discoveries
- Other vital information for continuity and consistency

Strictly only output a JSON object with the following format:

{
  "storySegment": "{opening paragraph or scene, 65-200 words}",
  "newStorySummary": "{summary, max 45 words}",
  "options": {
    "option1": { 
      "text": "{option text, 10-30 words}",
      "risk": "{risk level, low, medium, high}",
    },
    "option2": {
      "text": "{option text, 10-30 words}",
      "risk": "{risk level, low, medium, high}",
    },
    "option3": {
      "text": "{option text, 10-30 words}",
      "risk": "{risk level, low, medium, high}",
    },
    "option4": {
      "text": "{option text, 10-30 words}",
      "risk": "{risk level, low, medium, high}",
    },
    "option5": {
      "text": "{option text, 10-30 words}",
      "risk": "{risk level, low, medium, high}",
    }
  }
}

`;

console.log("storySummary: " + storySummary.slice(-16).join(' - '))
  let response;
  let responseObject: NextStoryPart = {
    storySegment: '',
    newStorySummary: '',
    storyStatus: '',
    options: {},
  };
  let success = false;

  while (!success) {
    try {
      response = await chatGPTRequest(prompt2, apiKey);
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

export default fetchNextStoryPart;