import chatGPTRequest from '../chatGPTRequest';
import processJson from '../utils/processJson';
import filterOptions from '../utils/filterOptions';

interface NextStoryPart {
  storySegment: string;
  newStorySummary: string;
  storyStatus: string;
  options: { [key: string]: string };
}

const fetchNextStoryPart = async (
  storySummary: string,
  previousParagraph: string,
  input: string,
  chosenCharacter: string,
  chosenGenre: string,
  characterTraits: string[],
  characterBio: string,
  apiKey: string,
): Promise<NextStoryPart> => {

  const prompt3 = `
  In the text-based adventure game, the user plays as the main character: ${chosenCharacter}, in the text-adventure genre: ${chosenGenre}, with character traits: "${characterTraits.join('", "')}" and character bio: "${characterBio}".
  Your task is to craft a compelling story segment (65-200 words) following the previous paragraph: ${previousParagraph}, user's choice: "${input}", and the previous summary "${storySummary}". Focus on:

  - Maintaining consistency with the story so far
  - Avoiding clichés
  - Writing captivating sentences
  - Using vivid language and sensory details
  - Building tension and suspense
  - Developing meaningful choices and consequences
  - Expanding on interesting characters and relationships
  - Balancing action, dialogue, and description
  - Incorporating twists, surprises, and subverted expectations
  
  Based on the story segment, provide the user with 3 to 5 options in "options" that naturally follow the current part of the story, offering opportunities for them to interact with the scene or explore the options. Ensure that each option is meaningful, consistent with the game's setting and character details, and leads to diverse story paths.
  
  Provide a comprehensive summary of, previous summary, previous paragraph, user choice and the new story segment to be created (max 400 words) in "newStorySummary" that precisely captures all crucial details from the current story segment, serving as a reference to build the next paragraph without expanding the story beyond the current segment. Ensure that the summary includes:

  - A detailed breakdown of character interactions, including actions, dialogues, emotions, and reactions
  - The exact locations of all characters, specifying their positions and any changes in location during the segment
  - The current inventory of items for each character, including the acquisition, usage, or loss of items
  - Any changes in the relationships between characters, such as alliances, conflicts, or other significant interactions
  - Key events, decisions, or discoveries that impact the direction of the story or the characters' motivations
  - Any other vital information required for maintaining continuity and consistency in the unfolding narrative
 
  Strictly use "storySegment", "newStorySummary", and "options" variables in the JSON object.

  Strictly only output a JSON object with the following format:
  
  {
    storySegment: "{story segment, 65-200 words}",
    newStorySummary: "{summary, max 400 words}",
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

  const responseObject: NextStoryPart = processJson<NextStoryPart>(response[0]);

  // Filter options
  const filteredOptions = filterOptions(responseObject.options);
  responseObject.options = filteredOptions;


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