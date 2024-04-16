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
    let storySegment: string;
    let options: any;
    let isFinal = false;
    setState((prevState) => ({ ...prevState, isLoading: true }));
    console.log("running again");

    let wrapUpDetails = {};

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

      if (isFinal) {
        wrapUpDetails = await fetchDetailedStorySummary(
          storySummary,
          apiKey,
          provider
        );
      }
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

    // Update state once with conditional properties
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
      ...(isFinal
        ? {
            isFinal: true,
            gameState: "endingScreen",
            ...wrapUpDetails,
          }
        : {}),
    }));
  };
  return handleUserInput;
};

export default useStoryProgress;
