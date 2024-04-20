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
import { saveOrUpdateStory } from "../helpers/indexedDB";

interface Option {
  text: string;
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
    try {
      let storySegment: string;
      let options: any;
      let isFinal = false;
      setState((prevState) => ({ ...prevState, isLoading: true }));

      let response,
        wrapUpDetails = {};

      if (turnCount >= 7) {
        response = await fetchEndingStoryPartAndOptions(
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
        response = await fetchNextStoryPartAndOptions(
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

      const newStorySummary = await fetchStorySummary(
        storySegment,
        apiKey,
        provider
      );

      setState((prevState) => ({
        ...prevState,
        storySummary: [
          ...prevState.storySummary,
          " :USERS CHOICE: " + option.text + " : " + newStorySummary,
        ],
        storyAndUserInputs: [
          ...prevState.storyAndUserInputs,
          option.text,
          storySegment,
        ],
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
    } catch (error) {
      console.error("Failed to process story progression:", error);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: "Failed to fetch story data, please try again.",
      }));
    }
  };
  return handleUserInput;
};

export default useStoryProgress;
