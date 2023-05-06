import React, { useState, useEffect } from 'react';
import { Synth, start, Transport, Part } from 'tone';

interface MusicPlayerProps {
  melody: { pitch: string; duration: number }[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ melody }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [part, setPart] = useState<Part | null>(null);

  const togglePlaying = async () => {
    if (!isPlaying) {
      await start();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const synth = new Synth().toDestination();

    const newPart = new Part(((time, note: { pitch: string; duration: number }) => {
      synth.triggerAttackRelease(note.pitch, note.duration, time);
    }), melody);

    newPart.loop = true;
    setPart(newPart);

    return () => {
      newPart.dispose();
    };
  }, [melody]);

  useEffect(() => {
    if (part) {
      if (isPlaying) {
        part.start();
        Transport.start();
      } else {
        part.stop();
        Transport.stop();
      }
    }
  }, [isPlaying, part]);

  return (
    <div>
      <button onClick={togglePlaying}>{isPlaying ? 'Stop Music' : 'Play Music'}</button>
    </div>
  );
};

export default MusicPlayer;