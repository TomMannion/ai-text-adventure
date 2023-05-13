// src/hooks/useStoryProgress.ts
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import fetchNextStoryPart from './fetchNextStoryPart';

interface Option {
  text: string;
  risk: string;
}

const useStoryProgress = () => {
  const { state, setState } = useContext(AppContext);
  const { storySummary, previousParagraph, chosenCharacter, chosenGenre, characterTraits, characterBio, apiKey } = state;

  const handleUserInput = async (option: Option) => {
    setState(prevState => ({ ...prevState, isLoading: true, input: option.text }));
    const { 
      storySegment, 
      newStorySummary,
      storyStatus, 
      options,
    } = await fetchNextStoryPart(
      storySummary,
      previousParagraph,
      option, // Use option.text here
      chosenCharacter,
      chosenGenre,
      characterTraits,
      characterBio,
      apiKey,
    );

    const optionFormatted = option.text;

    setState(prevState => ({
      ...prevState,
      storySummary: [...prevState.storySummary, optionFormatted, newStorySummary], // Use option.text here
      storyAndUserInputs: [...prevState.storyAndUserInputs, option.text, storySegment], // Use option.text here
      storyStatus, turnCount: prevState.turnCount + 1,
      previousParagraph: storySegment,
      options,
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
