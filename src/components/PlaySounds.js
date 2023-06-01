import React, { useState } from 'react';
import * as Tone from 'tone'; // <-- Import Tone.js here
import { playSound } from './playSound'; // Assuming the playSound function is in a file called playSound.js

function SoundPlayers() {
    const [sound, setSound] = useState(null);

    async function handlePlay() {
        // Start audio context in response to user action
        await Tone.start();

        // Wait for a short delay to ensure the audio context has started
        await new Promise(resolve => setTimeout(resolve, 100));

        // Play the sound and save the player and loop to state
        const newSound = await playSound('rain');
        setSound(newSound);
    }

    function handleStop() {
        // Stop the sound if one is playing
        if (sound) {
            sound.player.stop();
            setSound(null);
        }
    }

    return (
        <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
}

export default SoundPlayers;
