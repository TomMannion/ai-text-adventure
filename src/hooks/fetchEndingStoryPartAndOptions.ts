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
    You are an AI guiding the next steps in our text-based adventure game. Remember, our main character is "${chosenCharacter}", who is ${characterGender}, belonging to the genre "${chosenGenre}". This character, endowed with unique traits [${characterTraits.join(
    ", "
  )}] and a compelling backstory "${characterBio}", is at the crux of the narrative.
    Reflecting on the summary of the last 16 turns here: ${formatStorySummary(
      storySummary.slice(-16)
    )}, and taking into account the user's recent choice "${
    input.text
  }", decide if the story should climax and conclude, or if it needs to escalate towards a compelling resolution.
    - If concluding: Set 'isFinal' to true. Craft a final segment (65-200 words) that delivers a fitting resolution aligned with the story's progression, thematic elements, and character development. The narrative should capture complex motivations, intertwining subplots or backstory elements, and evoke a strong emotional response like suspense or catharsis.
    - If continuing: Set 'isFinal' to false. Develop the story further, heightening tension and progressing towards a climax. Introduce innovative twists, employing literary techniques such as foreshadowing, non-linear narratives, or vivid imagery to enhance depth and interest. Avoid clichés and ensure each segment is immersive, detailed, and respects the gravity of user decisions.
    In both scenarios:
    - Use second person ("you" or "your") to maintain an engaging, personal connection with the player.
    - Include detailed, immersive descriptions that bring scenes to life, heighten engagement, and build suspense.
    - Ensure the story progresses logically from previous segments, reflecting user choices and building upon them.
    - Develop character relationships and dynamics, enriching the narrative fabric and balancing action, dialogue, and descriptive elements for a well-rounded experience.
    Focus on delivering a narrative that not only advances or concludes the story but also enriches the player's experience by making each decision and story development memorable and impactful.
    Provide 2-4 options if continuing, tailored to the narrative and character actions.
    Strictly put your responses in this JSON format:
    {
      "storySegment": "Text of the final or ongoing story segment",
      "options": {
        "option1": { "text": "Option text, 10-30 words", "risk": "low, medium, or high" },
        // ... up to option4 in the same format
      },
      "isFinal": true if concluding the story, otherwise false
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
