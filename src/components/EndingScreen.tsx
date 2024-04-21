// src/components/EndingScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import "./EndingScreen.css";

interface EndingScreenProps {
  characterImage: string;
  output: string[];
  wrapUpParagraph: string;
  bigMoment: string;
  frequentActivity: string;
  characterTraitHighlight: string;
  themeExploration: string;
}

const EndingScreen: React.FC<EndingScreenProps> = ({
  characterImage,
  output,
  wrapUpParagraph,
  bigMoment,
  frequentActivity,
  characterTraitHighlight,
  themeExploration,
}) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [animationDuration, setAnimationDuration] = useState("50s"); // Default duration

  useEffect(() => {
    if (storyRef.current) {
      const storyHeight = storyRef.current.scrollHeight;
      const viewHeight = storyRef.current.clientHeight;
      storyRef.current.style.setProperty("--scroll-height", `${storyHeight}px`);
      storyRef.current.style.setProperty("--view-height", `${viewHeight}px`);

      // Adjust the scroll speed here, and calculate the loop point
      const speedFactor = 100; // Pixels per second
      const totalHeight = storyHeight + viewHeight;
      const newDuration = totalHeight / speedFactor; // Calculate the duration based on height and speed factor
      setAnimationDuration(`${newDuration}s`);
    }
  }, []);

  const sliceCount = 5;

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="ending-screen">
      <button className="pause-button" onClick={togglePause}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <div className="character-portrait">
        {Array.from({ length: sliceCount }, (_, index) => (
          <img
            key={index}
            src={characterImage}
            alt={`Character slice ${index + 1}`}
            className="character-slice"
            style={{
              clipPath: `polygon(
                0% ${Math.max(0, 20 * index - 1)}%, 
                100% ${Math.max(0, 20 * index - 1)}%, 
                100% ${Math.min(100, 20 * (index + 1) + 1)}%, 
                0% ${Math.min(100, 20 * (index + 1) + 1)}%
              )`,
              animationDelay: `${0.1 * index}s`,
            }}
          />
        ))}
      </div>
      <div
        className={`story-summary ${isPaused ? "paused" : ""}`}
        ref={storyRef}
        style={{ animationDuration: animationDuration }}
      >
        <h1>The End</h1>
        <p>{output[output.length - 1]}</p>
        <h1>Story Summary</h1>
        <p>{wrapUpParagraph}</p>
        <h2>Biggest Moment</h2>
        <p>{bigMoment}</p>
        <h2>Frequent Activity</h2>
        <p>{frequentActivity}</p>
        <h2>Character Highlight</h2>
        <p>{characterTraitHighlight}</p>
        <h2>Anthem of your Story!</h2>
        <p>{themeExploration}</p>
      </div>
    </div>
  );
};

export default EndingScreen;
