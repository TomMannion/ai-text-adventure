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
  input: string,
  chosenCharacter: string,
  chosenGenre: string,
  characterTraits: string[],
  characterBio: string,
  apiKey: string,
): Promise<NextStoryPart> => {

  const prompt = `
  In the text-based adventure game, the user plays as the main character: ${chosenCharacter}, in the text-adventure genre: ${chosenGenre}, with character traits: "${characterTraits.join('", "')}" and character bio: "${characterBio}".
  Your task is to craft a interesting story segment (65-200 words) following the previous paragraph: ${previousParagraph}, user's choice: "${input}", and the summary of previous segments and choices "${storySummary.slice(-16).join(' - ')}". Focus on:

  - Maintaining consistency with the story so far
  - Avoiding clichés
  - If you introduce an enemy or entity try to to avoid being vague, give it a name or/and a detailed varied description
  - try to not repeat similar story segments, try to make each segment unique and interesting
  - Weight up the users previous choices and segments and current choice based on the previous paragraph, if you deem the user's choice as risky it is your choice to punish (punishment can include death) them or give them a reward
  - it is you choice if the story segment is positive or negative, but it must be interesting and engaging
  - Writing captivating sentences
  - Using vivid language and sensory details
  - Building tension and suspense
  - Developing meaningful choices and consequences
  - Expanding on interesting characters and relationships
  - Balancing action, dialogue, and description
  - Incorporating twists, surprises, and subverted expectations
  
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
    storySegment: "{story segment, 65-200 words}",
    newStorySummary: "{summary, max 45 words}",
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
      response = await chatGPTRequest(prompt, apiKey);
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


  // const parseResponse = (responseText: string): NextStoryPart => {
  //   console.log('responseText', responseText)
  //   const nextPartLine = responseText.match(/next part:.*?(?=Summary:)/si)?.[0];
  //   const summaryOfNextPartLine = responseText.match(/summary:.*?(?=game status:)/si)?.[0];
  //   const storyStatusLine = responseText.match(/game status:.*$/si)?.[0];
  
  //   const nextPartOfStory = nextPartLine?.slice(nextPartLine.indexOf(':') + 1).trim() ?? '';
  //   const summaryOfNextPart = summaryOfNextPartLine?.slice(summaryOfNextPartLine.indexOf(':') + 1).trim() ?? '';
  //   const storyStatus = storyStatusLine?.slice(storyStatusLine.indexOf(':') + 1).trim() ?? '';

  //   // add console.log statements here to debug
  //   console.log('nextPartOfStory', nextPartOfStory);
  //   console.log('summaryOfNextPart', summaryOfNextPart);
  //   console.log('storyStatus', storyStatus);
  //   return { nextPartOfStory, summaryOfNextPart, storyStatus, options: {} };
  // };

  // const customParseResponse = (response: string): NextStoryPart => {
  //   try {
  //     const storyMatch = response.match(/"storyStart":\s+"([^"]*)"/);
  //     const nextPartOfStory = storyMatch ? storyMatch[1] : '';
  
  //     const summaryMatch = response.match(/"summary":\s+"([^"]*)"/);
  //     const summaryOfNextPart = summaryMatch ? summaryMatch[1] : '';
  
  //     const storyStatusMatch = response.match(/"storyStatus":\s+"([^"]*)"/);
  //     const storyStatus = storyStatusMatch ? storyStatusMatch[1] : '';
  
  //     const updatedCharactersSummaryMatch = response.match(/"updatedCharactersSummary":\s+"([^"]*)"/);
  //     const updatedCharactersSummary = updatedCharactersSummaryMatch ? updatedCharactersSummaryMatch[1] : '';
  
  //     const options: { [key: string]: string } = {};
  //     const optionsRegex = /"option\d+":\s+"([^"]*)"/g;
  //     let optionMatch: RegExpExecArray | null;
  
  //     while ((optionMatch = optionsRegex.exec(response)) !== null) {
  //       const optionText = optionMatch[1];
  //       const optionNumber = optionMatch[0].match(/\d+/)![0];
  //       options['option' + optionNumber] = optionText;
  //     }
  
  //     return {
  //       nextPartOfStory,
  //       summaryOfNextPart,
  //       storyStatus,
  //       updatedCharactersSummary,
  //       options,
  //     };
  //   } catch (error) {
  //     console.error('Error parsing custom response:', error);
  //     throw error;
  //   }
  // };