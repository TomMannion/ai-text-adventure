// MyStories.tsx

import React, { useEffect, useState, useContext } from "react";
import {
  fetchStoriesFromDB,
  deleteStoryFromDB,
  loadStoryFromDB,
} from "../helpers/indexedDB";
import { AppContext } from "../AppContext";
import "./MyStories.css";
import { StateTimeline } from "tone";

type Story = {
  id: number;
  chosenCharacter: string;
  previousParagraph: string;
  characterImage: string;
};

const MyStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetchedStories = await fetchStoriesFromDB();
        setStories(fetchedStories);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    };

    fetchStories();
    // console.log(stories);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteStoryFromDB(id);
      setStories(stories.filter((story) => story.id !== id));
      alert("Story deleted!");
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const { setState, state } = useContext(AppContext);

  const handleLoad = async (id: number) => {
    try {
      const storyData = await loadStoryFromDB(id);
      const apiKeySave = state.apiKey;
      setState(storyData);
      setState((prevState) => ({
        ...prevState,
        apiKey: apiKeySave,
        isLoading: false,
      }));
      alert("Story loaded!");
    } catch (error) {
      console.error("Failed to load story:", error);
    }
  };

  const truncate = (input: string, num: number) => {
    const words = input.split(" ");
    return words.length > num ? `${words.slice(0, num).join(" ")}...` : input;
  };

  return (
    <>
      {stories.length > 0 ? (
        <div className="stories-container">
          {stories.map((story) => (
            <div className="story-card" key={story.id}>
              <div className="card-content-story">
                <h3 className="character-name-story">
                  {story.chosenCharacter}
                </h3>
                <img
                  className="character-image-story"
                  src={story.characterImage}
                  alt={story.chosenCharacter}
                />
                <p className="story-paragraph">
                  {truncate(story.previousParagraph, 50)}
                </p>
              </div>
              <div className="card-buttons">
                <button onClick={() => handleDelete(story.id)}>Delete</button>
                <button onClick={() => handleLoad(story.id)}>Load</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-stories-message">No saved stories available</div>
      )}
    </>
  );
};

export default MyStories;
