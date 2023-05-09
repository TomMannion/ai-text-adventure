import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
  return (
    <div className={`loading-overlay ${show ? 'visible' : 'hidden'}`}>
      <div className="loading-text">
        Loading<span className="dot dot-1">.</span>
        <span className="dot dot-2">.</span>
        <span className="dot dot-3">.</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
