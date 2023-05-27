import * as Tone from 'tone';

let melody = null;
let harmony = null;
let rain = null;

// let rainBuffer = new Tone.Buffer({
//   url: "/rain.mp3",
//   onload: () => {
//     rain = new Tone.Player(rainBuffer).toDestination();
//     rain.loop = true;
//     rain.volume.value = 6; // adjust volume here
//     rain.start();
//   },
//   onerror: () => console.error('Error loading rain.mp3'),
// });


let melodySynth = new Tone.AMSynth({
    harmonicity: 3.999,
    detune: 0,
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.01,
      decay: 0.5,
      sustain: 1,
      release: 2 // increased release time
    },
    modulation: {
      type: "triangle"
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 2 // increased release time
    },
    // portamento: 0.05 // add a bit of portamento
  }).toDestination();
  let harmonySynth = new Tone.AMSynth({
    harmonicity: 3.999,
    volume: -5,
    detune: 0,
    oscillator: {
      type: "fatsawtooth"
    },
    envelope: {
      attack: 0.01,
      decay: 0.5,
      sustain: 1,
      release: 1 // increased release time
    },
    modulation: {
      type: "square"
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 1 // increased release time
    },
    // portamento: 0.05 // add a bit of portamento
  }).toDestination();

  let reverb = new Tone.Reverb(9).toDestination();
  melodySynth.connect(reverb);  
  // harmonySynth.connect(reverb);


const melodies = [
    ["A3", "B3", "C4", "D4", "E4", "F4", "G#4", "A4"],
    ["A3", "C4", "E4", "D4", "F4", "G#4", "A4", "B3"],
    ["A4", "G#4", "F4", "E4", "D4", "C4", "B3", "A3"],
    ["A3", "E4", "D4", "F4", "A4", "C4", "G#4", "B3"],
    ["G#4", "B3", "A4", "D4", "C4", "E4", "F4", "A3"],
    ["A3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"],
    ["B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3"],
    ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"],
    ["D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"],
  ];
  
  
  const harmonies = [
    [["A3", "C4", "E4"], ["B3", "D4", "F4"], ["C4", "E4", "G#4"], ["D4", "F4", "A4"]],
    [["D4", "F4", "A4"], ["C4", "E4", "G#4"], ["B3", "D4", "F4"], ["A3", "C4", "E4"]],
    [["A3", "C4", "E4"], ["C4", "E4", "G#4"], ["B3", "D4", "F4"], ["D4", "F4", "A4"]],
    [["E4", "G#4", "B4"], ["D4", "F4", "A4"], ["E4", "G#4", "B4"], ["F4", "A4", "C5"]],
    [["G#3", "C4", "E4"], ["A3", "C4", "E4"], ["F4", "A4", "C5"], ["E4", "G#4", "B4"]],
    [["A3", "C4", "E4"], ["G3", "B3", "D4"], ["F3", "A3", "C4"], ["E3", "G3", "B3"]],
    [["D3", "F3", "A3"], ["C3", "E3", "G3"], ["B2", "D3", "F3"], ["A2", "C3", "E3"]],
    [["G2", "B2", "D3"], ["F2", "A2", "C3"], ["E2", "G2", "B2"], ["D2", "F2", "A2"]],
    [["C2", "E2", "G2"], ["B1", "D2", "F2"], ["A1", "C2", "E2"], ["G1", "B1", "D2"]],
    [["F1", "A1", "C2"], ["E1", "G1", "B1"], ["D1", "F1", "A1"], ["C1", "E1", "G1"]],
  ];
  
  let melodyCount = 0;
  let harmonyCount = 0;
  let melodyMaxCount = 0;
  let harmonyMaxCount = 0;
  
  const createMelody = () => {
    if (melody) {
      melody.dispose();
    }
    const melodyNotes = melodies[Math.floor(Math.random() * melodies.length)];
    melody = new Tone.Sequence((time, note) => {
      melodySynth.triggerAttackRelease(note, "8n", time);
    }, melodyNotes, "8n");
  
    melody.start();
    melodyCount = 0;
    melodyMaxCount = Math.floor(Math.random() * 4) + 1; // random number between 1 and 4
  };
  
  const createHarmony = () => {
    if (harmony) {
      harmony.dispose();
    }
    const harmonyChords = harmonies[Math.floor(Math.random() * harmonies.length)];
    harmony = new Tone.Sequence((time, chord) => {
      harmonySynth.triggerAttackRelease(chord, "4n", time);
    }, harmonyChords, "4n");
  
    harmony.start();
    harmonyCount = 0;
    harmonyMaxCount = Math.floor(Math.random() * 4) + 1; // random number between 1 and 4
  };
  
  const startRain = async () => {
    if (rain) {
        rain.loop = true;
        rain.start();
    }
};

export const startMusic = async () => {
  await Tone.start();

  Tone.Transport.bpm.value = 60;

  createMelody();
  createHarmony();

    Tone.Transport.scheduleRepeat((time) => {
        melodyCount++;
        harmonyCount++;
        if (melodyCount <= melodyMaxCount) {
          Tone.Draw.schedule(() => {
            createMelody();
          }, time);
        }
        if (harmonyCount <= harmonyMaxCount) {
          Tone.Draw.schedule(() => {
            createHarmony();
          }, time);
        }
    }, "1n"); // one measure

    Tone.Transport.start();
};
  
  export const stopMusic = () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
  
    if (melody) {
      melody.dispose();
      melody = null;
    }
  
    if (harmony) {
      harmony.dispose();
      harmony = null;
    }
  };
  