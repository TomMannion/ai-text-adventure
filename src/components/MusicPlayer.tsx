import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

type GenreSettings = {
  scale: string[];
  loopInterval: number;
  synthSettings: Tone.SynthOptions;
};

interface MusicPlayerProps {
  genre: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ genre }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const genreSettings: Record<string, GenreSettings> = {
    Fantasy: {
      scale: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
      loopInterval: Tone.Time('4n').toSeconds(),
      synthSettings: {
        oscillator: {
          type: 'triangle',
          phase: 0,
          volume: 0,
          mute: false,
          onstop: () => {},
        },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
          attackCurve: 'linear',
          decayCurve: 'exponential',
          releaseCurve: 'exponential',
        },
        portamento: 0,
        onsilence: () => {},
        detune: 0,
        volume: 0,
        context: new Tone.Context(),
      },
    },
    TraditionalHorror: {
        scale: ['C3', 'C#3', 'E3', 'F3', 'F#3', 'A3', 'B3'],
        loopInterval: Tone.Time('1m').toSeconds(),
        synthSettings: {
          oscillator: {
            type: 'sawtooth',
            phase: 0,
            volume: 0,
            mute: false,
            onstop: () => {},
          },
          envelope: {
            attack: 1,
            decay: 2,
            sustain: 0.5,
            release: 3,
            attackCurve: 'linear',
            decayCurve: 'exponential',
            releaseCurve: 'exponential',
          },
          portamento: 0,
          onsilence: () => {},
          detune: 0,
          volume: -10,
          context: new Tone.Context(),
        },
      },
    
    // ... the other genre settings
  };

  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!genreSettings[genre]) {
      console.error(`Invalid genre: ${genre}`);
      return;
    }

    const { scale, loopInterval, synthSettings } = genreSettings[genre];
    const synth = new Tone.Synth(synthSettings).toDestination();

    const loop = new Tone.Loop((time) => {
      const note = scale[Math.floor(Math.random() * scale.length)];
      synth.triggerAttackRelease(note, loopInterval, time);
    }, loopInterval);

    if (isPlaying) {
      Tone.start();
      loop.start(0);
      Tone.Transport.start();
    } else {
      loop.stop(0);
      Tone.Transport.stop();
    }

    return () => {
      loop.stop();
      loop.dispose();
      Tone.Transport.stop();
    };
  }, [isPlaying, genre]);

  return (
    <div>
      <button onClick={togglePlaying}>{isPlaying ? 'Stop Music' : 'Play Music'}</button>
    </div>
  );
};

export default MusicPlayer;