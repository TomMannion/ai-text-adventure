import chatGPTRequest from "../chatGPTRequest";
import processJson from "../utils/processJson";
import filterOptionsNew from "../utils/filterOptionsNew";

interface StartOfStory {
  storyStart: string;
  options: { [key: string]: { text: string } };
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const defaultDelayMs = 5000; // Default delay of 5000 ms

const fetchStoryStart = async (
  chosenGenre: string,
  chosenCharacter: string,
  characterTraits: string[],
  characterBio: string,
  characterGender: string,
  apiKey: string,
  provider: string
): Promise<StartOfStory> => {
  // const prompt1 = `
  // Please read the following instructions carefully before proceeding:
  // You're an AI writing a text-based adventure game. The protagonist is ${chosenCharacter}, who is ${characterGender}, with these traits: "${characterTraits.join(
  //   '", "'
  // )}" and this backstory: "${characterBio}".
  // The genre of our game is ${chosenGenre}. First, Craft a compelling opening scene (65-200 words) that starts the adventure. Make sure to:
  // - When addressing the main character refer to them as "you" or "your"
  // - Choose a unique and lesser-known setting within the genre
  // - Use vivid language to write engaging sentences
  // - Build suspense and tension
  // - Introduce choices that have real consequences
  // - Present relationships between characters
  // - Balance action, dialogue, and description
  // - Surprise the reader with twists and subverted expectations
  // - Set the mood and atmosphere of the scene

  // Second, create 3 to 5 game options in the options key of the JSON that continue the story. Each option (10-30 words) should allow the player to explore the scene or interact with characters. Make sure each option fits the game's setting, leads to different story paths, and includes a risk level (low, medium, high). Include a "risky" option if possible.

  // Strictly put your responses in this JSON format:
  // {
  //   "storyStart": "{opening paragraph or scene, 65-200 words}",
  //   "options": {
  //     "option1": {
  //       "text": "{option text, 10-30 words}",
  //       "risk": "{risk level, low, medium, high}",
  //     },
  //     // ... up to option5 in the same format
  //   }
  // }

  // `;

  const prompt1 = `
  Using the available parameters:
  - Character's Name: ${chosenCharacter}
  - Chosen Genre: ${chosenGenre}
  - Character Traits: ${characterTraits.join(
    ", "
  )}  // Optional, use to enrich the narrative when fitting
  - Character Bio: ${characterBio}  // Optional, draw from it to add depth when suitable
  
  Generate an engaging opening scene of 65-200 words that sets the stage for the adventure, appropriate to the chosen genre. The scene should introduce the setting, hint at initial conflicts or dilemmas, and may incorporate the character's traits or backstory if they naturally fit the context. The narrative should immediately engage players and prepare them for diverse pathways in the story.
  - Use second person ("you" or "your") to maintain an engaging, personal connection with the player.

  Generate 2-4 compelling options for the player, each branching out from the latest choice and story so far. These should provide a diverse range of follow-up actions or reactions, indicating different potential paths the story could take. Please keep each option text between 10-30 words.
  In the option text please only include what the character could do.

  Output should be in the following JSON format:
  
  {
    "storyStart": "Generated text here that effectively sets the scene.",
    "options": {
      "option1": { "text": "A decision or action related to an immediate challenge. (10-30 words)"},
      "option2": { "text": "An alternative approach or strategy based on the scene's context. (10-30 words)"},
      // Additional options up to a total of 4, each varied and dynamically created based on the scene
    }
  }
  `;

  let attempts = 0;
  const maxAttempts = 5; // Maximum number of attempts before failing

  while (attempts < maxAttempts) {
    try {
      const response = await chatGPTRequest(prompt1, apiKey, provider);
      const responseObject: StartOfStory = processJson<StartOfStory>(
        response[0]
      );

      const filteredOptions = filterOptionsNew(responseObject.options);
      responseObject.options = filteredOptions;

      return responseObject; // Return response on success
    } catch (error: any) {
      console.error("Failed to parse retrying");
    }
  }
  throw new Error("Max retry attempts reached, unable to fetch data.");
};

const fetchStorySummary = async (
  storyStart: string,
  apiKey: string,
  provider: string
): Promise<string> => {
  const prompt2 = `
  Given the following story start: "${storyStart}", write a concise summary of the opening story segment in one paragraph. The summary should include:
  - A summary of character interactions (actions, dialogues, emotions, reactions)
  - Exact locations of characters and changes in location
  - Current inventory of each character (acquisition, usage, or loss of items)
  - Changes in character relationships (alliances, conflicts, interactions)
  - Key events or discoveries that affect the story or characters
  - Any other important details for narrative consistency and continuity

  Strictly put your responses in this JSON format:
  {
    "newStorySummary": "{summary of story segment}",
  }
  `;

  let attempts = 0;
  const maxAttempts = 10; // Maximum number of retry attempts

  while (attempts < maxAttempts) {
    try {
      const response = await chatGPTRequest(prompt2, apiKey, provider);
      const responseObject = processJson<{ newStorySummary: string }>(
        response[0]
      );
      return responseObject.newStorySummary; // Successfully return the summary
    } catch (error: any) {
      console.error("Failed to parse retrying");
    }
  }
  throw new Error("Max retry attempts reached, unable to fetch data.");
};

export { fetchStoryStart, fetchStorySummary };
