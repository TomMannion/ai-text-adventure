import React from "react";
import "./LoadingBar.css";

interface LoadingBarProps {
  progress: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  const numberOfRectangles = Math.floor(progress / 10);
  const loadingBarFill = Array.from(Array(numberOfRectangles), (_, i) => (
    <div key={i} className="loading-bar-rectangle"></div>
  ));

  return (
    <div className="loading-bar-wrapper">
      <h2 className="loading-bar-text">Generating the story...</h2>
      <div className="loading-bar">
        {loadingBarFill}
      </div>
    </div>
  );
};

export default LoadingBar;

