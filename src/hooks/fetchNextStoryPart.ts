import chatGPTRequest from "../chatGPTRequest";
import processJson from "../utils/processJson";
import filterOptionsNew from "../utils/filterOptionsNew";

interface NextStoryPart {
  storySegment: string;
  options: { [key: string]: { text: string; risk: string } };
}

const fetchNextStoryPartAndOptions = async (
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
  // const formatStorySummary = (storySummary: string[]): string => {
  //   let storySummaryFormatted = "";

  //   for (let i = 0; i < storySummary.length; i++) {
  //     if (i % 2 === 0) {
  //       storySummaryFormatted += `${i / 2 + 1} Story Segment: "${
  //         storySummary[i]
  //       }" - `;
  //     } else {
  //       storySummaryFormatted += `User's Choice: "${storySummary[i]}"\n`;
  //     }
  //   }

  //   return storySummaryFormatted;
  // };
  const prompt1 = `
  You're an AI continuing our text adventure game featuring "${chosenCharacter}", who is ${characterGender}, in the genre "${chosenGenre}". They have traits like "${characterTraits.join(
    '", "'
  )}", and a backstory "${characterBio}". Here's a brief of the recent plot and user choices: ${storySummary.slice(
    -16
  )}. 
  Given the recent events "${previousParagraph}" and the user's latest action "${
    input.text
  }", craft the next segment (65-200 words). This should:
  - Follow logically from previous events and user choices.
  - Use second person for the main character.
  - Incorporate literary techniques to enhance depth (e.g., foreshadowing, vivid imagery).
  - Include immersive descriptions, build suspense, and develop character dynamics.
  - Offer balanced action, dialogue, and descriptions.
  - Reflect user decisions, maintaining all character traits and backstory relevance.
  
  Provide 2-4 choices for further exploration, each distinct and logical.

  Strictly put your responses in this JSON format:
  {
    "storySegment": "Text of the opening paragraph or scene, 65-200 words",
    "options": {
      "option1": { "text": "Option text, 10-30 words", "risk": "low, medium, or high" },
      // ... up to option4 in the same format
    }
  }  
  `;

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
