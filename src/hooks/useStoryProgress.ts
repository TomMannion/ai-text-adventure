// hooks/useStoryProgress.ts
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import fetchNextStoryPart from './fetchNextStoryPart';

const useStoryProgress = () => {
  const { state, setState } = useContext(AppContext);
  const { storySummary, previousParagraph, chosenCharacter, chosenGenre, characterTraits, characterBio, charactersList, apiKey } = state;

  const handleUserInput = async (input: string) => {
    setState(prevState => ({ ...prevState, isLoading: true, input }));
    const { nextPartOfStory, summaryOfNextPart, storyStatus, options, updatedCharactersSummary } = await fetchNextStoryPart(
      storySummary,
      previousParagraph,
      input,
      chosenCharacter,
      chosenGenre,
      characterTraits,
      characterBio,
      charactersList,
      apiKey,
    );

    setState(prevState => ({
      ...prevState,
      storySoFar: [...prevState.storySoFar, input, summaryOfNextPart],
      storyAndUserInputs: [...prevState.storyAndUserInputs, input, nextPartOfStory],
      turnCount: prevState.turnCount + 1,
      previousParagraph: nextPartOfStory,
      options,
      characterList: updatedCharactersSummary,
      isLoading: false,
    }));

    if (storyStatus === 'completed' || storyStatus === 'died') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setState({ ...state, gameState: 'genreSelection' });
    }
  };

  return handleUserInput;
};

export default useStoryProgress;