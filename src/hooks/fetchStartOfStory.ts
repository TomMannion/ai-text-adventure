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
  Please create an engaging and compelling opening for a text-based adventure game set in the ${chosenGenre} genre, focusing on the following aspects:
  - Hook the reader with a captivating sentence.
  - Use vivid language and sensory details.
  - Introduce tension or suspense.
  - Present the main character in an interesting manner.
  - Balance action, dialogue, and description.

  you are playing as the character ${chosenCharacter}.
  their personality is "${characterTraits.join('", "')}", and back story is "${characterBio}".
  Based on the setting and these guidelines, craft an opening paragraph or scene that instantly grabs the reader's attention and sets the stage for the adventure to come. The word count should be between 65 and 200 words. Provide the user with a random number of options (3 to 5) to choose from, giving them ample opportunities to comment on the scene or options.

  Ensure you are outputting a JSON object with the following format:

  {
    storyStart: "the story start should go here, between 65-150 words",
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



