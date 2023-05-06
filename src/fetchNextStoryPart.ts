import chatGPTRequest from './chatGPT';

interface NextStoryPart {
  nextPart: string;
  summaryOfNextPart: string;
  storyStatus: string;
  updatedCharactersSummary: string;
  options: { [key: string]: string };
}

const fetchNextStoryPart = async (
  name: string,
  storySummary: string,
  input: string,
  characterTraits: string[],
  characterBio: string,
  genre: string,
  apiKey: string,
  previousParagraph: string,
  charactersList: string

): Promise<NextStoryPart> => {
  // const prompt = `
  //   Current game world: "${gameWorld}"
  //   Users Character personality: "${characterTraits.join('", "')}", "${characterBio}".
  //   Story so far: ${storySummary}
  //   User action: ${input}
  //   Please provide the next part of the story for a text based adventure game, Ensure you are using the following format for the response:

  //   Next part: {next_story_part}
  //   Summary: {summary_of_next_story_part}
  //   Story status: {please choose one of the following options to describe the current status of the story: "in progress", "completed", "died"}

  //   Ensure that the next part of the story includes a choice or decision for the user to make.
  //   Ensure If the user's action is improbable or does not make sense in the context of the story, either partial ignore the request or punish the user for poor decision-making by making the story more challenging, or introducing negative consequences this can include the user dying which should be reflected in the story status.
  // `;

  // const prompt2 = `
  // The text-based adventure game story so far is: "${storySummary}". The previous paragraph provided in full is: "${previousParagraph}". The user's choice based on the previous paragraph is: "${input}".

  // Based on the story so far create an engaging and compelling next part of the story for a text-based adventure game set in the ${gameWorld} genre, focusing on the following aspects: 
  
  // Ensure format your response as follows:

  // Next Part: {next part of the story}
  // Summary: {summary of next part of the story}
  // Game Status: {in progress, completed, you died}
  // ` 

const prompt3 = `
The text-based adventure game story so far is: "${storySummary}".
The previous paragraph provided in full is: "${previousParagraph}".
The user's choice based on the previous paragraph is: "${input}".

Considering the following concepts for creating compelling writing in a text-based adventure game set in the ${genre} genre, please provide the next part of the story referring to the user's choice and the previous paragraph taking into account the following concepts:

Hooking the reader with captivating sentences
Using vivid language and sensory details
Maintaining tension and suspense
Giving meaningful choices with consequences
Developing interesting characters
Balancing action, dialogue, and description
Twists and surprises
Subverting expectations

You are playing as the character ${name}.
Their personality is "${characterTraits.join('", "')}", and back story is "${characterBio}".
The current list of characters in the story is: "${charactersList}". Please find a way to involve these characters in the story, either by having them exit the story or by being an active part of the story. Also, provide a summary of any new characters and current characters still left in the story in charactersSummary.

Provide the user with a random number of options (3 to 5) to choose from, giving them ample opportunities to comment on the scene or options.

Ensure the output is a JSON object with the exact following format:

{
  storyStart: "{please ensure the next part of the start is here, between 65-150 words}",
  summary: "{summary_of_story_start, no more than 30 words}",
  storyStatus: "{in progress, completed, you died}",
  charactersSummary: "{summary of new and current characters, no more than 50 words}",
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

  // const parseResponse = (responseText: string): NextStoryPart => {
  //   console.log('responseText', responseText)
  //   const nextPartLine = responseText.match(/next part:.*?(?=Summary:)/si)?.[0];
  //   const summaryOfNextPartLine = responseText.match(/summary:.*?(?=game status:)/si)?.[0];
  //   const storyStatusLine = responseText.match(/game status:.*$/si)?.[0];
  
  //   const nextPart = nextPartLine?.slice(nextPartLine.indexOf(':') + 1).trim() ?? '';
  //   const summaryOfNextPart = summaryOfNextPartLine?.slice(summaryOfNextPartLine.indexOf(':') + 1).trim() ?? '';
  //   const storyStatus = storyStatusLine?.slice(storyStatusLine.indexOf(':') + 1).trim() ?? '';

  //   // add console.log statements here to debug
  //   console.log('nextPart', nextPart);
  //   console.log('summaryOfNextPart', summaryOfNextPart);
  //   console.log('storyStatus', storyStatus);
  //   return { nextPart, summaryOfNextPart, storyStatus, options: {} };
  // };

  const customParseResponse = (response: string): NextStoryPart => {
    try {
      const storyMatch = response.match(/"storyStart":\s+"([^"]*)"/);
      const nextPart = storyMatch ? storyMatch[1] : '';
  
      const summaryMatch = response.match(/"summary":\s+"([^"]*)"/);
      const summaryOfNextPart = summaryMatch ? summaryMatch[1] : '';
  
      const storyStatusMatch = response.match(/"storyStatus":\s+"([^"]*)"/);
      const storyStatus = storyStatusMatch ? storyStatusMatch[1] : '';
  
      const updatedCharactersSummaryMatch = response.match(/"updatedCharactersSummary":\s+"([^"]*)"/);
      const updatedCharactersSummary = updatedCharactersSummaryMatch ? updatedCharactersSummaryMatch[1] : '';
  
      const options: { [key: string]: string } = {};
      const optionsRegex = /"option\d+":\s+"([^"]*)"/g;
      let optionMatch: RegExpExecArray | null;
  
      while ((optionMatch = optionsRegex.exec(response)) !== null) {
        const optionText = optionMatch[1];
        const optionNumber = optionMatch[0].match(/\d+/)![0];
        options['option' + optionNumber] = optionText;
      }
  
      return {
        nextPart,
        summaryOfNextPart,
        storyStatus,
        updatedCharactersSummary,
        options,
      };
    } catch (error) {
      console.error('Error parsing custom response:', error);
      throw error;
    }
  };

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
      const nextPart = responseObject.storyStart;
      const summaryOfNextPart = responseObject.summary;
      const storyStatus = responseObject.storyStatus;
      const options = responseObject.options;
      const updatedCharactersSummary = responseObject.updatedCharactersSummary;
  
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
        nextPart,
        summaryOfNextPart,
        storyStatus,
        updatedCharactersSummary,
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
