import chatGPTRequest from "../chatGPTRequest";
import processJson from "../utils/processJson";
import filterOptionsNew from "../utils/filterOptionsNew";

interface NextStoryPart {
  storySegment: string;
  options: { [key: string]: { text: string } };
  isFinal: boolean;
}

interface StorySummary {
  wrapUpParagraph: string;
  bigMoment: string;
  frequentActivity: string;
  characterTraitHighlight: string;
  themeExploration: string;
}

const fetchEndingStoryPartAndOptions = async (
  storySummary: string[],
  previousParagraph: string,
  input: { text: string },
  chosenCharacter: string,
  chosenGenre: string,
  characterTraits: string[],
  characterBio: string,
  characterGender: string,
  apiKey: string,
  provider: string
): Promise<NextStoryPart> => {
  const formatStorySummary = (storySummary: string[]): string => {
    return storySummary
      .map((part, index) => `${index + 1}: ${part}`)
      .join("\n");
  };

  const prompt = `
  Based on the following parameters:
  - Character's Name: ${chosenCharacter}
  - Chosen Genre: ${chosenGenre}
  - Character Traits: ${characterTraits.join(
    ", "
  )} // Optional, use to enrich the narrative when fitting
  - Character Bio: ${characterBio} // Optional, draw from it to add depth when suitable
  - Recent Story Summary: ${storySummary.slice(-16)}
  - Previous Paragraph: ${previousParagraph}
  - User's Latest Choice: ${input.text}
  
  Create an engaging and concise story segment of about 70-200 words that pushes towards the climactic ending of the narrative, incorporating the user's latest choice and the details provided. The story should align with the character's traits and backstory, while providing a rich, genre-appropriate atmosphere. Consider potential conflicts or resolutions that could arise, pushing the plot towards its culmination.
  
  Generate 2-4 compelling options for the player, each continuing from the latest choice and story so far. These options should be leading the user towards a climatic end based on the users last choice and story so far.

  Output should be in the following JSON format:
  
  {
    "storySegment": "Generated text here that ties together all elements provided, leading towards the climax.",
    "options": {
      "option1": { "text": "What does the character do next, considering the immediate consequences? (10-30 words)"},
      "option2": { "text": "How does the character reflect or react internally to recent events? (10-30 words)"},
      // Additional options up to a total of 4, each varied and dynamically created based on the scene
    },
    "isFinal": false // Set to true if this segment concludes the story
  }  
  `;

  let response;
  let responseObject: NextStoryPart = {
    storySegment: "",
    options: {},
    isFinal: false,
  };
  let success = false;

  while (!success) {
    try {
      response = await chatGPTRequest(prompt, apiKey, provider);
      responseObject = processJson<NextStoryPart>(response[0]);

      const filteredOptions = filterOptionsNew(responseObject.options);
      responseObject.options = filteredOptions;

      // console.log("responseObject", responseObject);
      success = true;
    } catch (error) {
      console.error("Error processing response, retrying request...", error);
    }
  }

  return responseObject;
};

const fetchDetailedStorySummary = async (
  storySummary: string[],
  apiKey: string,
  provider: string
): Promise<StorySummary> => {
  const formatStorySummary = (storySummary: string[]): string => {
    return storySummary
      .map((part, index) => `${index + 1}: ${part}`)
      .join("\n");
  };

  const prompt = `
  Imagine you're creating a "Story Wrapped" for this adventure, much like Spotify Wrapped but for the epic tale we've just experienced! Below is the entire story progression. Use this to generate a vibrant and shareable summary that not only captures the essence but also highlights the fun, quirky, and most memorable moments:
  ${formatStorySummary(storySummary)}

  1. **Epic Recap**: Whip up a catchy and fun summary of the story. Think of it as the back cover of a best-selling novel.
  2. **Showstopper Moment**: Pinpoint the most thrilling or hilarious moment in the story. The kind of moment that would make headlines in the story world!
  3. **Signature Move**: What's one thing the character just couldn't stop doing? Make it sound like a fun plot quirk that fans would tweet about.
  4. **Character Quirk**: Shine a light on a hilarious or defining trait of the main character that made the story uniquely theirs.
  5. **Theme Song**: If this story had a theme song, based on the main themes explored, what would it be? Describe it in a fun way that matches the story's vibe.

Please format the responses like this, ready to be shared and enjoyed on social media in this JSON format:
{
  "wrapUpParagraph": "{Epic Recap text}",
  "bigMoment": "{Showstopper Moment}",
  "frequentActivity": "{Signature Move}",
  "characterTraitHighlight": "{Character Quirk}",
  "themeExploration": "{Theme Song}"
}
`;

  let response;
  let responseObject: StorySummary = {
    wrapUpParagraph: "",
    bigMoment: "",
    frequentActivity: "",
    characterTraitHighlight: "",
    themeExploration: "",
  };
  let success = false;

  while (!success) {
    try {
      response = await chatGPTRequest(prompt, apiKey, provider);
      responseObject = processJson<StorySummary>(response[0]);
      success = true;
    } catch (error) {
      console.error("Error processing response, retrying request...", error);
    }
  }

  return responseObject;
};

export { fetchEndingStoryPartAndOptions, fetchDetailedStorySummary };
