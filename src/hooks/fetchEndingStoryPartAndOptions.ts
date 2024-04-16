import chatGPTRequest from "../chatGPTRequest";
import processJson from "../utils/processJson";
import filterOptionsNew from "../utils/filterOptionsNew";

interface NextStoryPart {
  storySegment: string;
  options: { [key: string]: { text: string; risk: string } };
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
  input: { text: string; risk: string },
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
    Analyze the current trajectory of the story based on the last 16 turns. Here is a brief summary of previous segments and choices:
    ${formatStorySummary(storySummary.slice(-16))}
    Previously, "${previousParagraph}", the user chose "${
    input.text
  }". Given the chosen genre "${chosenGenre}" and the character "${chosenCharacter}" (who is ${characterGender}) with traits [${characterTraits.join(
    ", "
  )}] and backstory "${characterBio}", determine if it's time to bring the story towards a climax and conclusion.
    If so, create a final segment (65-200 words) that provides a resolution or climax fitting the story's progression and themes.
    If not, continue the story logically, maintaining tension and progression towards an eventual climax.
    Also, provide options reflecting either a move towards conclusion or ongoing development, with appropriate risk levels.
    If it is the final story segment, please only include one option in 'option1' with the text: 'THE END',
    e.g.

    Strictly put your responses in this JSON format:
    {
      "storySegment": "{final or ongoing segment text}",
      "options": {
        "option1": { "text": "{option text, 10-30 words}", "risk": "{risk level}" },
        "option2": { "text": "{option text, 10-30 words}", "risk": "{risk level}" },
        "option3": { "text": "{option text, 10-30 words}", "risk": "{risk level}" }
      },
      "isFinal": {true if this is the final segment, else false}
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
      // console.log("Detailed Story Summary:", responseObject);
      success = true;
    } catch (error) {
      console.error("Error processing response, retrying request...", error);
    }
  }

  return responseObject;
};

export { fetchEndingStoryPartAndOptions, fetchDetailedStorySummary };
