const tempo = 132;
const beatsPerBar = 4;
const stepsPerBar = 16;
const secondsPerBeat = 60 / tempo;
const stepSeconds = secondsPerBeat / 4;
const loopSteps = stepsPerBar * 8;
const lookAheadSeconds = 0.12;
const schedulerMs = 35;
const musicVolume = 0.24;

let audioContext = null;
let masterGain = null;
let delayNode = null;
let delayFeedback = null;
let nextStep = 0;
let nextStepTime = 0;
let schedulerId = null;
let isMuted = false;

const bassSeedNotes = [
  'F1', 'C2', 'F2', 'G1', 'Ab1', 'Eb2', 'C3', 'Bb1',
  'Db1', 'Ab1', 'Db2', 'Eb2', 'F1', 'C2', 'Ab2', 'G1',
  'Eb1', 'Bb1', 'Eb2', 'F2', 'G1', 'Db2', 'Bb2', 'C2',
  'F1', 'Ab1', 'C2', 'Eb3', 'G2', 'Bb1', 'Db3', 'C2',
  'Ab1', 'F2', 'Bb1', 'C3', 'Eb2', 'G1', 'Ab2', 'Db2',
  'Db1', 'F1', 'Ab2', 'Bb2', 'C2', 'Eb1', 'F2', 'G2',
  'Bb1', 'Db2', 'F3', 'Eb2', 'C2', 'Ab1', 'G2', 'Bb2',
  'F1', 'Eb2', 'Db1', 'C3', 'Ab1', 'Bb2', 'G1', 'F2'
];

const bassPool = [
  'F1', 'G1', 'Ab1', 'Bb1', 'C2', 'Db2', 'Eb2', 'F2',
  'G2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3', 'F3'
];

const chordRootSeeds = ['F3', 'Db3', 'Ab3', 'Eb3', 'Bb2', 'G2', 'C3', 'Eb3', 'F3', 'Ab2', 'Db3', 'Bb2'];
const chordRootPool = ['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3', 'F3', 'G3', 'Ab3', 'Bb3', 'C4'];
const chordShapes = [
  [-12, 0, 3, 7, 10, 19],
  [-12, 0, 3, 7, 12, 22],
  [-12, 0, 4, 7, 10, 24],
  [-12, 0, 3, 8, 12, 20],
  [-19, -7, 0, 5, 10, 17],
  [-12, 0, 2, 7, 11, 19],
  [-24, -12, 0, 7, 15, 22],
  [-12, -5, 0, 3, 10, 21]
];
const leadSeedNotes = [
  'C4', 'Eb5', 'F6', 'Ab4', 'G5', 'Eb6', 'C5', 'Bb3',
  'Ab5', 'C4', 'Db6', 'F5', 'Eb4', 'C6', 'Bb4', 'Ab3',
  'F6', 'Ab4', 'C6', 'Bb5', 'Ab3', 'F5', 'Eb6', 'C4',
  'Db5', 'F6', 'Ab4', 'C6', 'Bb3', 'Ab5', 'G6', 'Eb4',
  'G4', 'Bb5', 'Db6', 'F4', 'C5', 'Ab6', 'Eb5', 'G6',
  'Bb3', 'F5', 'Ab4', 'Db6', 'C4', 'Eb6', 'G5', 'Bb4',
  'F4', 'C6', 'Eb4', 'Ab5', 'Db5', 'G6', 'F5', 'Bb5',
  'Ab3', 'Eb5', 'C6', 'G4', 'Db6', 'F6', 'Bb3', 'Eb6'
];
const leadPool = [
  'F3', 'G3', 'Ab3', 'Bb3', 'C4', 'Db4', 'Eb4', 'F4',
  'G4', 'Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'G5',
  'Ab5', 'Bb5', 'C6', 'Db6', 'Eb6', 'F6', 'G6', 'Ab6', 'Bb6', 'C7'
];
const accentSeedNotes = [
  'F7', 'C7', 'Ab6', 'Eb7', 'Db7', 'Bb6', 'G6', 'C7',
  'F6', 'Ab7', 'Eb6', 'Bb7', 'Db6', 'G7', 'C6', 'F7'
];
const accentPool = ['C6', 'Db6', 'Eb6', 'F6', 'G6', 'Ab6', 'Bb6', 'C7', 'Db7', 'Eb7', 'F7', 'G7', 'Ab7', 'Bb7'];

const bassNotes = createDiverseNotes(bassSeedNotes, bassPool, 5, 5, 11);
const chordRoots = createDiverseNotes(chordRootSeeds, chordRootPool, 5, 3, 5);
const leadNotes = createDiverseNotes(leadSeedNotes, leadPool, 5, 7, 13);
const accentNotes = createDiverseNotes(accentSeedNotes, accentPool, 5, 9, 7);

const bassVolumes = [0.22, 0.08, 0.18, 0.11, 0.2, 0.07, 0.15, 0.1, 0.19, 0.12, 0.16, 0.06];
const leadVolumes = [0.035, 0.085, 0.045, 0.105, 0.028, 0.07, 0.04, 0.095, 0.052, 0.032, 0.088, 0.06];
const humanTiming = [-0.018, 0.009, -0.006, 0.016, -0.011, 0.005, 0.019, -0.008, 0.012, -0.014, 0.004, 0.01];
const humanVelocity = [0.82, 1.14, 0.74, 1.22, 0.9, 1.07, 0.78, 1.18, 0.68, 1.26, 0.96, 1.1];
const phraseDynamics = [1.02, 0.9, 1.12, 0.84, 1.18, 0.96, 1.08, 0.88];

export async function startBackgroundMusic() {
  if (!audioContext) {
    audioContext = new AudioContext();
    createMusicGraph();
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  if (schedulerId) {
    return;
  }

  nextStep = 0;
  nextStepTime = audioContext.currentTime + 0.04;
  schedulerId = window.setInterval(scheduleMusic, schedulerMs);
}

export function setMusicMuted(muted) {
  isMuted = muted;

  if (!masterGain || !audioContext) {
    return;
  }

  const targetVolume = muted ? 0.0001 : musicVolume;
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(targetVolume, audioContext.currentTime + 0.08);
}

function createMusicGraph() {
  masterGain = audioContext.createGain();
  masterGain.gain.value = isMuted ? 0.0001 : musicVolume;

  delayNode = audioContext.createDelay(0.8);
  delayNode.delayTime.value = 0.28;

  delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = 0.22;

  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  delayNode.connect(masterGain);
  masterGain.connect(audioContext.destination);
}

function scheduleMusic() {
  while (nextStepTime < audioContext.currentTime + lookAheadSeconds) {
    scheduleStep(nextStep, nextStepTime);
    nextStep = (nextStep + 1) % loopSteps;
    nextStepTime += stepSeconds;
  }
}

function scheduleStep(step, time) {
  const localStep = step % stepsPerBar;
  const bar = Math.floor(step / stepsPerBar);
  const feel = getHumanFeel(step, localStep);
  const phrase = getPhraseFeel(bar, localStep);

  if (localStep % 4 === 0) {
    playKick(time + feel.kickOffset, (feel.strong ? 1.08 : 0.96) * phrase.energy);
  }

  if (localStep === 4 || localStep === 12) {
    playSnare(time + feel.timeOffset, feel.velocity * phrase.energy);
  }

  playHat(time + feel.hatOffset, localStep, feel.velocity * phrase.hatEnergy);

  if (localStep === 3 || localStep === 7 || localStep === 11 || localStep === 15) {
    playOpenHat(time + feel.timeOffset, feel.velocity * phrase.hatEnergy);
  }

  if (localStep % 2 === 0 || localStep === 3 || localStep === 7 || localStep === 15) {
    const bassIndex = (bar * 4 + Math.floor(localStep / 2)) % bassNotes.length;
    playBass(bassNotes[bassIndex], time + feel.timeOffset + phrase.lilt, bassVolumes[bassIndex % bassVolumes.length] * feel.velocity * phrase.energy, localStep, feel.detune);
  }

  if (shouldPlayGhost(step, localStep)) {
    const ghostIndex = (step * 5 + bar * 11) % bassNotes.length;
    playGhostBass(bassNotes[ghostIndex], time + stepSeconds * 0.58 + feel.timeOffset, feel.velocity * phrase.energy, feel.detune);
  }

  if (localStep === 0 || localStep === 4 || localStep === 8 || localStep === 12) {
    playChord(chordRoots[bar % chordRoots.length], time + feel.chordOffset + phrase.lilt, chordShapes[bar % chordShapes.length], localStep, feel.velocity * phrase.energy, feel.detune);
  }

  if (localStep === 2 || localStep === 6 || localStep === 10 || localStep === 14) {
    const leadIndex = (step * 3 + bar * 7 + Math.floor(localStep / 2) * 5) % leadNotes.length;
    playLead(leadNotes[leadIndex], time + feel.timeOffset + phrase.lilt, bar, leadVolumes[leadIndex % leadVolumes.length] * feel.velocity * phrase.energy, feel.detune);
  }

  if ((bar + localStep) % 5 === 0 && localStep % 2 === 1) {
    playTechnoAccent(accentNotes[(step + bar * 9) % accentNotes.length], time + feel.timeOffset, bar, feel.velocity * phrase.energy, feel.detune);
  }

  if (shouldPlayBubble(step, localStep)) {
    playBubble(time + feel.timeOffset + stepSeconds * 0.24, step, feel.velocity * phrase.energy);
  }

  if (localStep === 15 && bar % 2 === 0) {
    playBubbleRun(time + feel.timeOffset, step, phrase.energy);
  }

  if (localStep === 8 && bar % 2 === 1) {
    playPulsePad(chordRoots[(bar + 1) % chordRoots.length], time + feel.chordOffset + phrase.lilt, feel.velocity * phrase.energy, feel.detune);
  }
}

function playBass(note, time, volume, localStep, detune) {
  const oscillator = createOscillator('square', note, time);
  const filter = audioContext.createBiquadFilter();
  const gain = createEnvelope(time, volume * 0.9, 0.006, 0.11, volume * 0.08);

  filter.type = 'lowpass';
  filter.Q.value = 8;
  filter.frequency.setValueAtTime(localStep % 4 === 0 ? 1200 : 520, time);
  filter.frequency.exponentialRampToValueAtTime(localStep % 8 === 0 ? 120 : 210, time + 0.13);
  oscillator.detune.setValueAtTime((localStep % 8 === 0 ? -18 : 12) + detune, time);
  oscillator.detune.linearRampToValueAtTime((localStep % 8 === 0 ? 6 : -10) - detune * 0.4, time + 0.28);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  startAndStop(oscillator, time, 0.16);
}

function playGhostBass(note, time, velocity, detune) {
  const oscillator = createOscillator('triangle', note, time);
  const filter = audioContext.createBiquadFilter();
  const gain = createEnvelope(time, 0.035 * velocity, 0.004, 0.065, 0.003);

  filter.type = 'lowpass';
  filter.Q.value = 5;
  filter.frequency.setValueAtTime(420, time);
  filter.frequency.exponentialRampToValueAtTime(160, time + 0.06);
  oscillator.detune.setValueAtTime(detune * 0.6, time);
  oscillator.detune.linearRampToValueAtTime(-detune * 0.3, time + 0.06);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  startAndStop(oscillator, time, 0.08);
}

function playChord(root, time, intervals, localStep, velocity, detune) {
  intervals.forEach((interval, index) => {
    const noteTime = time + index * 0.006 + getHumanNoise(index + localStep) * 0.007;
    const oscillator = createOscillator(index % 2 === 0 ? 'sawtooth' : 'triangle', transpose(root, interval), noteTime);
    const filter = audioContext.createBiquadFilter();
    const peak = 0.018 + index * 0.006;
    const gain = createEnvelope(noteTime, peak * velocity, 0.015 + index * 0.002, 0.18, peak * 0.18);

    filter.type = 'lowpass';
    filter.Q.value = 6;
    filter.frequency.setValueAtTime(localStep % 8 === 0 ? 1800 : 900, noteTime);
    filter.frequency.exponentialRampToValueAtTime(260 + index * 90, noteTime + 0.16);

    oscillator.detune.setValueAtTime((index % 2 === 0 ? -14 : 14) + detune, noteTime);
    oscillator.detune.linearRampToValueAtTime((index % 2 === 0 ? 8 : -8) - detune * 0.5, noteTime + 0.18);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    gain.connect(delayNode);
    startAndStop(oscillator, noteTime, 0.28);
  });
}

function playLead(note, time, bar, volume, detune) {
  const oscillator = createOscillator('square', note, time);
  const gain = createEnvelope(time, volume * 0.75, 0.006, 0.09, volume * 0.12);
  const filter = audioContext.createBiquadFilter();

  filter.type = 'bandpass';
  filter.frequency.value = bar % 2 === 0 ? 2200 : 3600;
  filter.Q.value = bar % 3 === 0 ? 5 : 9;
  oscillator.detune.setValueAtTime((bar % 2 === 0 ? -24 : 24) + detune, time);
  oscillator.detune.linearRampToValueAtTime((bar % 2 === 0 ? 18 : -18) - detune * 0.6, time + 0.2);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  gain.connect(delayNode);
  startAndStop(oscillator, time, 0.12);
}

function playTechnoAccent(note, time, bar, velocity, detune) {
  const oscillator = createOscillator(bar % 2 === 0 ? 'sawtooth' : 'square', note, time);
  const filter = audioContext.createBiquadFilter();
  const gain = createEnvelope(time, (0.035 + (bar % 3) * 0.018) * velocity, 0.003, 0.075, 0.006);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(bar % 2 === 0 ? 4200 : 2600, time);
  filter.frequency.exponentialRampToValueAtTime(bar % 2 === 0 ? 1100 : 5200, time + 0.06);
  filter.Q.value = 10;
  oscillator.detune.setValueAtTime((bar % 2 === 0 ? -36 : 36) + detune, time);
  oscillator.detune.linearRampToValueAtTime((bar % 2 === 0 ? 42 : -42) - detune, time + 0.07);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  gain.connect(delayNode);
  startAndStop(oscillator, time, 0.09);
}

function playBubble(time, step, velocity) {
  const startNote = accentNotes[(step * 3 + 5) % accentNotes.length];
  const endNote = accentNotes[(step * 7 + 11) % accentNotes.length];
  const oscillator = createOscillator('sine', startNote, time);
  const filter = audioContext.createBiquadFilter();
  const gain = createEnvelope(time, 0.045 * velocity, 0.006, 0.16, 0.004);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(620 + getHumanNoise(step) * 900, time);
  filter.frequency.exponentialRampToValueAtTime(2400 + getHumanNoise(step + 2) * 1800, time + 0.12);
  filter.Q.value = 12;
  oscillator.frequency.exponentialRampToValueAtTime(noteToFrequency(endNote), time + 0.11);
  oscillator.detune.setValueAtTime((getHumanNoise(step + 8) - 0.5) * 30, time);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  gain.connect(delayNode);
  startAndStop(oscillator, time, 0.18);
}

function playBubbleRun(time, step, velocity) {
  for (let index = 0; index < 3; index += 1) {
    playBubble(time + index * stepSeconds * 0.38, step + index * 5, velocity * (0.78 + index * 0.12));
  }
}

function playPulsePad(root, time, velocity, detune) {
  [-24, -12, 0, 7, 10, 15, 24].forEach((interval, index) => {
    const oscillator = createOscillator('sawtooth', transpose(root, interval), time);
    const filter = audioContext.createBiquadFilter();
    const peak = index === 0 ? 0.018 : 0.018 + index * 0.003;
    const gain = createEnvelope(time, peak * velocity, 0.08 + index * 0.004, 0.9, peak * 0.3);

    filter.type = 'lowpass';
    filter.frequency.value = 260 + index * 240;
    oscillator.detune.setValueAtTime((index % 2 === 0 ? -18 : 18) + detune, time);
    oscillator.detune.linearRampToValueAtTime((index % 2 === 0 ? 12 : -12) - detune * 0.4, time + 0.75);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    gain.connect(delayNode);
    startAndStop(oscillator, time, 1.05);
  });
}

function playKick(time, velocity) {
  const oscillator = createOscillator('sine', 'C2', time);
  const gain = createEnvelope(time, 0.28 * velocity, 0.005, 0.18, 0.008);

  oscillator.frequency.setValueAtTime(150, time);
  oscillator.frequency.exponentialRampToValueAtTime(32, time + 0.16);
  oscillator.connect(gain);
  gain.connect(masterGain);
  startAndStop(oscillator, time, 0.18);
}

function playSnare(time, velocity) {
  playNoise(time, 0.12 * velocity, 0.15, 1500);
}

function playHat(time, localStep, velocity) {
  const volume = localStep % 4 === 2 ? 0.035 : 0.018;
  playNoise(time, (volume + getHumanNoise(localStep) * 0.018) * velocity, 0.028, 8200 + getHumanNoise(localStep + 3) * 3200);
}

function playOpenHat(time, velocity) {
  playNoise(time, 0.055 * velocity, 0.11, 6200);
}

function playNoise(time, volume, duration, cutoff) {
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = createEnvelope(time, volume, 0.004, duration, 0.01);

  filter.type = 'highpass';
  filter.frequency.value = cutoff;
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start(time);
  source.stop(time + duration + 0.03);
}

function createOscillator(type, note, time) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(noteToFrequency(note), time);
  return oscillator;
}

function createEnvelope(time, peak, attack, release, sustain) {
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peak, time + attack);
  gain.gain.exponentialRampToValueAtTime(Math.max(sustain, 0.0001), time + attack + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + release);
  return gain;
}

function startAndStop(oscillator, time, duration) {
  oscillator.start(time);
  oscillator.stop(time + duration);
}

function createDiverseNotes(seedNotes, notePool, multiplier, jumpA, jumpB) {
  const notes = [];
  const targetLength = seedNotes.length * multiplier;

  for (let index = 0; index < targetLength; index += 1) {
    if (index % 5 === 0) {
      notes.push(seedNotes[index % seedNotes.length]);
      continue;
    }

    const poolIndex = (index * jumpA + Math.floor(index / 3) * jumpB + index ** 2) % notePool.length;
    notes.push(notePool[poolIndex]);
  }

  return notes;
}

function getHumanFeel(step, localStep) {
  const timingIndex = step % humanTiming.length;
  const velocityIndex = (step * 3 + localStep) % humanVelocity.length;
  const baseOffset = humanTiming[timingIndex];

  return {
    timeOffset: localStep % 4 === 0 ? baseOffset * 0.35 : baseOffset,
    hatOffset: baseOffset * 0.5,
    chordOffset: baseOffset * 0.7,
    kickOffset: baseOffset * 0.2,
    velocity: humanVelocity[velocityIndex],
    detune: (getHumanNoise(step) - 0.5) * 18,
    strong: localStep === 0 || localStep === 8
  };
}

function getPhraseFeel(bar, localStep) {
  const energy = phraseDynamics[bar % phraseDynamics.length];
  const hatEnergy = energy * (localStep % 2 === 0 ? 0.9 : 1.08);
  const lilt = localStep % 2 === 1 ? 0.009 : -0.004;

  return { energy, hatEnergy, lilt };
}

function shouldPlayGhost(step, localStep) {
  return localStep % 4 === 1 && getHumanNoise(step + 19) > 0.38;
}

function shouldPlayBubble(step, localStep) {
  return (localStep === 5 || localStep === 9 || localStep === 13) && getHumanNoise(step + 41) > 0.28;
}

function getHumanNoise(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function noteToFrequency(note) {
  const match = note.match(/^([A-G]b?)(\d)$/);
  const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const semitone = noteNames.indexOf(match[1]);
  const octave = Number(match[2]);
  const midi = 12 * (octave + 1) + semitone;
  return 440 * 2 ** ((midi - 69) / 12);
}

function transpose(note, semitones) {
  const match = note.match(/^([A-G]b?)(\d)$/);
  const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const start = noteNames.indexOf(match[1]) + Number(match[2]) * 12;
  const shifted = start + semitones;
  return `${noteNames[shifted % 12]}${Math.floor(shifted / 12)}`;
}
