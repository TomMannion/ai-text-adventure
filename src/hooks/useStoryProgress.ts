// hooks/useStoryProgress.ts
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import fetchNextStoryPart from './fetchNextStoryPart';

const useStoryProgress = () => {
  const { state, setState } = useContext(AppContext);
  const { storySummary, previousParagraph, chosenCharacter, chosenGenre, characterTraits, characterBio, charactersList, apiKey } = state;

  const handleUserInput = async (input: string) => {
    setState(prevState => ({ ...prevState, isLoading: true, input }));
    const { 
      nextPartOfStory, 
      nextStorySummary,
      storyStatus, 
      options
    } = await fetchNextStoryPart(
      storySummary,
      previousParagraph,
      input,
      chosenCharacter,
      chosenGenre,
      characterTraits,
      characterBio,
      apiKey,
    );

    setState(prevState => ({
      ...prevState,
      storySummary: nextStorySummary,
      storyAndUserInputs: [...prevState.storyAndUserInputs, input, nextPartOfStory],
      turnCount: prevState.turnCount + 1,
      previousParagraph: nextPartOfStory,
      options,
      isLoading: false,
    }));
    console.log('nextStorySummary: ' + nextStorySummary);

    if (storyStatus === 'completed' || storyStatus === 'died') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setState({ ...state, gameState: 'genreSelection' });
    }
  };

  return handleUserInput;
};

export default useStoryProgress;