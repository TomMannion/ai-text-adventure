import React, { useState } from 'react';
import { startMusic, stopMusic } from './music';

function DroneComponent() {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleButtonClick = () => {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }

        setIsPlaying(!isPlaying);
    }

    return (
        <button onClick={handleButtonClick}>
            {isPlaying ? 'Stop Music' : 'Start Music'}
        </button>
    );
}

export default DroneComponent;


