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
  Please assess the current trajectory of our text-based adventure game based on the last 16 turns. Here’s a summary of recent segments and user choices:
  ${formatStorySummary(storySummary.slice(-16))}
  Previously, "${previousParagraph}", the user chose "${
    input.text
  }". Considering the genre "${chosenGenre}" and our main character "${chosenCharacter}", who is ${characterGender}, with traits [${characterTraits.join(
    ", "
  )}] and a backstory "${characterBio}", decide if it's time to steer the story towards a climax and conclusion.
  
  Determine the course of action:
  - If its time for the climax: Craft a final segment (65-200 words) that delivers a fitting resolution or climax, deeply aligned with the storys progression, thematic elements, and character development. The narrative should reflect complex character motivations, incorporate subplots or backstory elements where relevant, and evoke a strong emotional response such as suspense or catharsis. Provide only one option for the user with the text: 'The End'.
  - If the story should continue: Develop the narrative logically, maintaining tension and leading towards a potential climax. Use innovative scenarios or twists that align with but refresh the genre conventions. Each segment should avoid clichés, feature rich descriptions that enhance immersion, and weave in literary techniques such as foreshadowing, metaphor, or non-linear elements to add depth and intrigue.
  
  Ensure all content is original, avoids overused tropes, and deeply engages the player emotionally and intellectually. Pay special attention to how the main character's personal journey is interwoven with the broader plot developments.
  
  Structure your response strictly in this JSON format:
  {
    "storySegment": "Text of the final or ongoing story segment",
    "options": {
      "option1": { "text": "Option text, 10-30 words", "risk": "Risk level" },
      ...(include more options if not concluding)
    },
    "isFinal": true if concluding the story, otherwise false
  }
  
  Focus on delivering a narrative that not only continues or concludes the story but also enriches the player's experience by making each decision and story development memorable and impactful.
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
