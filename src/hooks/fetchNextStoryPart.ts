import chatGPTRequest from '../chatGPTRequest';

interface NextStoryPart {
  nextPartOfStory: string;
  nextStorySummary: string;
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
  The text-based adventure game's current story summary: "${storySummary}" please use this to create the next part of the story in "story".
  The user's choice based on the previous paragraph is: "${input}".

  Considering the following concepts for creating compelling writing in a text-based adventure game set in the ${chosenGenre} genre, please provide the next part of the story referring to the user's choice and current story summary continuing on from where the summary stops taking into account the following concepts:

  Hooking the reader with captivating sentences
  Using vivid language and sensory details
  Maintaining tension and suspense
  Giving meaningful choices with consequences
  Developing interesting characters
  Balancing action, dialogue, and description
  Twists and surprises
  Subverting expectations

  the story is allowed to end, but it is not required to, if character dies, please set storyStatus to "you died", if the story is completed, please set storyStatus to "completed", if the story is still in progress, please set storyStatus to "in progress".

  You are playing as the character ${chosenCharacter}.
  Their personality is "${characterTraits.join('", "')}", and back story is "${characterBio}".
  Please also provide a summary of the story so far in "summary", it should include the summary so far, any characters currently in the story, next part of the story you provide and the user's choice based on the previous paragraph in 400 words or less.
  Provide the user with a random number of options (3 to 5) to choose from, giving them ample opportunities to comment on the scene or options.

  Ensure the output is a JSON object with the exact following format:

  {
    story: "{please ensure the next part of the start is here, between 65-150 words}",
    summary: "{summary of story so far, no more than 400 words}",
    storyStatus: "{in progress, completed, you died}",
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

  const lenientJsonParse = (jsonString: string): any => {
    try {
      // Remove trailing commas from JSON string
      const cleanedJsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');
  
      // Parse the cleaned JSON string into a JavaScript object
      const jsonObject = JSON.parse(cleanedJsonString);
  
      return jsonObject;
    } catch (error) {
      console.error('Error parsing JSON response with lenient method:', error);
      throw error;
    }
  };

  const processJson = (response: string): NextStoryPart => {
    try {
      // Parse the JSON-formatted response string into a JavaScript object
      const responseObject = lenientJsonParse(response);
  
      // Extract the story_start, summary, and options from the responseObject
      const nextPartOfStory = responseObject.story;
      const nextStorySummary = responseObject.summary;
      const storyStatus = responseObject.storyStatus;
      const options = responseObject.options;
  
      // Filter out options with empty strings
      const filteredOptions: { [key: string]: string } = {};
      for (const key in options) {
        if (
          options[key].trim() !== null &&
          options[key].trim() !== '' &&
          options[key].trim() !== undefined &&
          options[key].trim() !== 'undefined' &&
          options[key].trim() !== 'null'
        ) {
          filteredOptions[key] = options[key];
        }
      }
  
      // Return the extracted data as a TypeScript object
      return {
        nextPartOfStory,
        nextStorySummary,
        storyStatus,
        options: filteredOptions,
      };
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw error;
    }
  };

  return processJson(response[0]);

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