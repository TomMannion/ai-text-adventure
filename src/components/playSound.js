import * as Tone from 'tone';

export async function playSound(word) {
    let soundUrl = '';

    switch(word) {
        case 'rain':
            soundUrl = 'https://cdn.pixabay.com/audio/2021/01/12/audio_b180cacbce.mp3'; // replace with the path to your rain sound
            break;
        // Add more cases here for more words/sounds
    }

    const player = new Tone.Player();
    player.autostart = false;
    await player.load(soundUrl);
    player.loop = true; // This will make the sound start over automatically when it finishes
    player.toDestination();
    player.start();

    Tone.Transport.start();
    return { player };
}

