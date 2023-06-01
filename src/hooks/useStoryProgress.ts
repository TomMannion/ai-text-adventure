// src/hooks/useStoryProgress.ts
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { fetchNextStoryPartAndOptions, fetchStorySummary } from './fetchNextStoryPart';
import { saveStoryToDB } from '../helpers/indexedDB';

interface Option {
  text: string;
  risk: string;
}

const useStoryProgress = () => {
  const { state, setState } = useContext(AppContext);
  const { storySummary, previousParagraph, chosenCharacter, chosenGenre, characterTraits, characterBio, characterGender, apiKey } = state;

  const handleUserInput = async (option: Option) => {
    setState(prevState => ({ ...prevState, isLoading: true, input: option.text }));

    // Fetch the next story part and options
    const { 
      storySegment, 
      options,
    } = await fetchNextStoryPartAndOptions(
      storySummary,
      previousParagraph,
      option,
      chosenCharacter,
      chosenGenre,
      characterTraits,
      characterBio,
      characterGender,
      apiKey,
    );

    // Fetch the story summary
    const { 
      newStorySummary,
      storyStatus, 
    } = await fetchStorySummary(
      storySegment,
      apiKey,
    );

    const optionFormatted = option.text;

    setState(prevState => ({
      ...prevState,
      storySummary: [...prevState.storySummary, optionFormatted, newStorySummary],
      storyAndUserInputs: [...prevState.storyAndUserInputs, option.text, storySegment],
      storyStatus, turnCount: prevState.turnCount + 1,
      previousParagraph: storySegment,
      options,
      isLoading: false,
    }));

    try {
      await saveStoryToDB(state);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
      

    if (storyStatus === 'completed' || storyStatus === 'died') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setState({ ...state, gameState: 'genreSelection' });
    }
  };

  return handleUserInput;
};

export default useStoryProgress;