import chatGPTRequest from "../chatGPTRequest";
import processJson from "../utils/processJson";
import filterOptionsNew from "../utils/filterOptionsNew";

interface NextStoryPart {
  storySegment: string;
  options: { [key: string]: { text: string } };
}

const fetchNextStoryPartAndOptions = async (
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
  const prompt1 = `
  Given the parameters:
  - Character's Name: ${chosenCharacter}
  - Chosen Genre: ${chosenGenre}
  - Character Traits: ${characterTraits.join(
    ", "
  )}  // Optional, use to enrich the narrative when fitting
  - Character Bio: ${characterBio}  // Optional, draw from it to add depth when suitable
  - Recent Story Summary: ${storySummary.slice(-16)}
  - Previous Paragraph: ${previousParagraph}
  - User's Latest Choice: ${input.text}
  
  Create an engaging and descriptive story segment of 65-200 words that directly responds to and develops from the user's latest choice. The segment should delve into the consequences of this choice, exploring how it influences the current situation, relationships, or the unfolding plot. Ensure the story remains open for future choices, maintaining an interactive and immersive experience.
  
  Generate 2-4 compelling options for the player, each branching out from the latest choice and story so far. These should provide a diverse range of follow-up actions or reactions, indicating different potential paths the story could take.
  
  Output should be in the following JSON format:
  
  {
    "storySegment": "Generated text here that builds directly on the user's last choice, advancing the story in a meaningful way.",
    "options": {
      "option1": { "text": "Detail a next step or delve into the consequences of the previous choice. (10-30 words)"},
      "option2": { "text": "Provide an alternative reaction or explore a subplot that might influence future events. (10-30 words)"},
      // Additional options up to a total of 4, each varied and dynamically created based on the scene
    }
  }`;

  while (true) {
    try {
      const response = await chatGPTRequest(prompt1, apiKey, provider);
      const responseObject: NextStoryPart = processJson<NextStoryPart>(
        response[0]
      );

      const filteredOptions = filterOptionsNew(responseObject.options);
      responseObject.options = filteredOptions;

      return responseObject;
    } catch (error: any) {
      console.error("Error processing response retrying");
    }
  }
};

const fetchStorySummary = async (
  storySegment: string,
  apiKey: string,
  provider: string
): Promise<string> => {
  const prompt2 = `
    Write a concise summary of this story segment "${storySegment}" in one paragraph no more than 40 words. The summary should include:
    - Character interactions (actions, dialogues, emotions, reactions)
    - Exact locations of characters and changes in location
    - Current inventory of each character (acquisition, usage, or loss of items)
    - Changes in character relationships (alliances, conflicts, interactions)
    - Key events or discoveries that affect the story or characters
    - Any other important details for narrative consistency and continuity

    Strictly put your responses in this JSON format:

    {
      "storySummary": "{summary of the story segment}",
    }
  `;

  while (true) {
    try {
      const response = await chatGPTRequest(prompt2, apiKey, provider);
      const responseObject = processJson<{ storySummary: string }>(response[0]);
      return responseObject.storySummary; // Return summary on success
    } catch (error: any) {
      console.error("Failed to parse retrying");
    }
  }
};

export { fetchNextStoryPartAndOptions, fetchStorySummary };
