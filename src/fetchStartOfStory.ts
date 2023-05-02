import chatGPTRequest from './chatGPT';

interface StartOfStory {
  storyStart: string;
  storySummary: string;
}

const fetchStartOfStory = async (
  traits: string[],
  bio: string,
  gameWorld: string,
  apiKey: string
): Promise<StartOfStory> => {
  const prompt = `
  Character personality: "${traits.join('", "')}", "${bio}".
  Game world: "${gameWorld}"
  Please provide the start of the story for a text-based adventure game, Ensure you are using the following format for the response:

  Story: {story_start, no more than 100 words}
  Summary: {summary_of_story_start, no more than 30 words}

  Ensure that the start of the story includes a choice or decision for the user to make.
  `;

  const response = await chatGPTRequest(prompt, apiKey);

  const parseResponse = (responseText: string): StartOfStory => {
    const storyStartLine = responseText.match(/Story:.*?(?=Summary:)/s)?.[0];
    const storySummaryLine = responseText.match(/Summary:.*$/s)?.[0];

    const storyStart = storyStartLine?.slice(storyStartLine.indexOf(':') + 1).trim() ?? '';
    const storySummary = storySummaryLine?.slice(storySummaryLine.indexOf(':') + 1).trim() ?? '';

    return { storyStart, storySummary };
  };
  

  return parseResponse(response[0]);
};

export default fetchStartOfStory;


