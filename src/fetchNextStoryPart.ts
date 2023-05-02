import chatGPTRequest from './chatGPT';

interface NextStoryPart {
  nextPart: string;
  summaryOfNextPart: string;
  storyStatus: string;
}

const fetchNextStoryPart = async (
  storySummary: string,
  input: string,
  characterTraits: string[],
  characterBio: string,
  gameWorld: string,
  apiKey: string
): Promise<NextStoryPart> => {
  const prompt = `
    Current game world: "${gameWorld}"
    Users Character personality: "${characterTraits.join('", "')}", "${characterBio}".
    Story so far: ${storySummary}
    User action: ${input}
    Please provide the next part of the story for a text based adventure game, Ensure you are using the following format for the response:

    Next part: {next_story_part}
    Summary: {summary_of_next_story_part}
    Story status: {please choose one of the following options to describe the current status of the story: "in progress", "completed", "died"}

    Ensure that the next part of the story includes a choice or decision for the user to make.
    Ensure If the user's action is improbable or does not make sense in the context of the story, either partial ignore the request or punish the user for poor decision-making by making the story more challenging, or introducing negative consequences this can include the user dying which should be reflected in the story status.
  `;

  const response = await chatGPTRequest(prompt, apiKey);

  const parseResponse = (responseText: string): NextStoryPart => {
    const nextPartLine = responseText.match(/Next part:.*?(?=\nSummary:)/s)?.[0];
    const summaryOfNextPartLine = responseText.match(/Summary:.*?(?=\nStory status:)/s)?.[0];
    const storyStatusLine = responseText.match(/Story status:.*$/s)?.[0];
  
    const nextPart = nextPartLine?.slice(nextPartLine.indexOf(':') + 1).trim() ?? '';
    const summaryOfNextPart = summaryOfNextPartLine?.slice(summaryOfNextPartLine.indexOf(':') + 1).trim() ?? '';
    const storyStatus = storyStatusLine?.slice(storyStatusLine.indexOf(':') + 1).trim() ?? '';

    // add console.log statements here to debug
    console.log('nextPart', nextPart);
    console.log('summaryOfNextPart', summaryOfNextPart);
    console.log('storyStatus', storyStatus);
    return { nextPart, summaryOfNextPart, storyStatus };
  };

  return parseResponse(response[0]);
};

export default fetchNextStoryPart;
