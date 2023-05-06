import chatGPTRequest from './chatGPT';

interface StartOfStory {
  storyStart: string;
  storySummary: string;
  options: { [key: string]: string };
}

const fetchStartOfStory = async (
  name: string,
  traits: string[],
  bio: string,
  genre: string,
  apiKey: string
): Promise<StartOfStory> => {
  // const prompt = `
  // Character personality: "${traits.join('", "')}", "${bio}".
  // Game world: "${gameWorld}"
  // Please provide the start of the story for a text-based adventure game, Ensure you are using the following format for the response:

  // Story: {story_start, no more than 100 words}
  // Summary: {summary_of_story_start, no more than 30 words}

  // Ensure that the start of the story includes a choice or decision for the user to make.
  // `;

//   const prompt2 = `
//   Please create an engaging and compelling opening for a text-based adventure game set in the ${gameWorld} genre, focusing on the following aspects:

// Hook the reader with a captivating sentence
// Use vivid language and sensory details
// Introduce tension or suspense
// Present the main character in an interesting manner
// Balance action, dialogue, and description
// Based on the setting and these guidelines, craft an opening paragraph or scene that instantly grabs the reader's attention and sets the stage for the adventure to come.
// The word count should be between 65 and 200 words. Provide the user with a random number of options (3 to 5) to choose from, giving them ample opportunities to comment on the scene or options.

// Story: {please ensure the start of the story is here, between 65-150 words}
// Summary: {summary_of_story_start, no more than 30 words}
// option1: "Option 1",
// option2": "Option 2",
// "option3": "Option 3",
// "option4": "Option 4, if applicable",
// "option5": "Option 5, if applicable"
//   `

const prompt3 = `
Please create an engaging and compelling opening for a text-based adventure game set in the ${genre} genre, focusing on the following aspects:
- Hook the reader with a captivating sentence.
- Use vivid language and sensory details.
- Introduce tension or suspense.
- Present the main character in an interesting manner.
- Balance action, dialogue, and description.

you are playing as the character ${name}.
their personality is "${traits.join('", "')}", and back story is "${bio}".
Based on the setting and these guidelines, craft an opening paragraph or scene that instantly grabs the reader's attention and sets the stage for the adventure to come. The word count should be between 65 and 200 words. Provide the user with a random number of options (3 to 5) to choose from, giving them ample opportunities to comment on the scene or options.

Ensure you are outputting a JSON object with the following format:

{
  storyStart: "the story start should go here, between 65-150 words",
  summary: "summary of story start, no more than 30 words",
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


  // const parseResponse = (responseText: string): StartOfStory => {
  //   const storyStartLine = responseText.match(/Story:.*?(?=Summary:)/s)?.[0];
  //   const storySummaryLine = responseText.match(/Summary:.*$/s)?.[0];
  //   // const options = 

  //   const storyStart = storyStartLine?.slice(storyStartLine.indexOf(':') + 1).trim() ?? '';
  //   const storySummary = storySummaryLine?.slice(storySummaryLine.indexOf(':') + 1).trim() ?? '';

  //   return { storyStart, storySummary, options: {} };
  // };

  const lenientJsonParse = (json: string): any => {
    const cleanedJson = json.replace(/,\s*(}|])/g, '$1');
    return JSON.parse(cleanedJson);
  };

  const processJson = (response: string): StartOfStory => {
    try {
      // Parse the JSON-formatted response string into a JavaScript object
      const responseObject = lenientJsonParse(response);
  
      // Extract the story_start, summary, and options from the responseObject
      const storyStart = responseObject.storyStart;
      const storySummary = responseObject.summary;
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
        ){
          filteredOptions[key] = options[key];
        }
      }
  
      // Return the extracted data as a TypeScript object
      return { storyStart, storySummary, options: filteredOptions };
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw error;
    }
  };
  return processJson(response[0]);
};

export default fetchStartOfStory;


