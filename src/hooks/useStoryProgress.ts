// src/hooks/useStoryProgress.ts
import { useContext } from "react";
import { AppContext } from "../AppContext";
import {
  fetchNextStoryPartAndOptions,
  fetchStorySummary,
} from "./fetchNextStoryPart";
import {
  fetchEndingStoryPartAndOptions,
  fetchDetailedStorySummary,
} from "./fetchEndingStoryPartAndOptions";

interface Option {
  text: string;
  risk: string;
}

const useStoryProgress = () => {
  const { state, setState } = useContext(AppContext);
  const {
    storySummary,
    previousParagraph,
    chosenCharacter,
    chosenGenre,
    characterTraits,
    characterBio,
    characterGender,
    apiKey,
    provider,
    turnCount,
  } = state;

  const handleUserInput = async (option: Option) => {
    setState((prevState) => ({ ...prevState, isLoading: true }));

    let storySegment: string;
    let options: any;
    let isFinal = false;

    if (turnCount >= 8) {
      // Concluding the story
      const response = await fetchEndingStoryPartAndOptions(
        storySummary,
        previousParagraph,
        option,
        chosenCharacter,
        chosenGenre,
        characterTraits,
        characterBio,
        characterGender,
        apiKey,
        provider
      );
      storySegment = response.storySegment;
      options = response.options;
      isFinal = response.isFinal;
    } else {
      // Continuing the story
      const response = await fetchNextStoryPartAndOptions(
        storySummary,
        previousParagraph,
        option,
        chosenCharacter,
        chosenGenre,
        characterTraits,
        characterBio,
        characterGender,
        apiKey,
        provider
      );
      storySegment = response.storySegment;
      options = response.options;
    }

    // Fetch the story summary
    const { newStorySummary, storyStatus } = await fetchStorySummary(
      storySegment,
      apiKey,
      provider
    );

    setState((prevState) => ({
      ...prevState,
      storySummary: [...prevState.storySummary, option.text, newStorySummary],
      storyAndUserInputs: [
        ...prevState.storyAndUserInputs,
        option.text,
        storySegment,
      ],
      storyStatus,
      turnCount: prevState.turnCount + 1,
      previousParagraph: storySegment,
      options,
      isLoading: false,
    }));

    if (isFinal) {
      const {
        wrapUpParagraph,
        bigMoment,
        frequentActivity,
        characterTraitHighlight,
        themeExploration,
      } = await fetchDetailedStorySummary(storySummary, apiKey, provider);
      setState({
        ...state,
        isFinal: isFinal,
        gameState: "endingScreen",
        wrapUpParagraph,
        bigMoment,
        frequentActivity,
        characterTraitHighlight,
        themeExploration,
      });
    }
  };

  return handleUserInput;
};

export default useStoryProgress;
