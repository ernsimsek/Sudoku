/**
 * Sound system using Web Audio API
 * Creates pleasant tones without external files
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.15,
  startDelay = 0
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.95,
      ctx.currentTime + startDelay + duration
    );

    gainNode.gain.setValueAtTime(0, ctx.currentTime + startDelay);
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startDelay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);

    oscillator.start(ctx.currentTime + startDelay);
    oscillator.stop(ctx.currentTime + startDelay + duration);
  } catch {
    // Silently fail if audio not supported
  }
}

export const sounds = {
  correct: () => {
    playTone(523.25, 0.1, 'sine', 0.12); // C5
    playTone(659.25, 0.15, 'sine', 0.12, 0.08); // E5
  },

  wrong: () => {
    playTone(200, 0.15, 'square', 0.08);
    playTone(150, 0.2, 'square', 0.06, 0.1);
  },

  complete: () => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      playTone(freq, 0.3, 'sine', 0.15, i * 0.1);
    });
  },

  achievement: () => {
    const notes = [659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      playTone(freq, 0.2, 'sine', 0.15, i * 0.08);
    });
  },

  streak: () => {
    playTone(880, 0.1, 'sine', 0.15);
    playTone(1100, 0.1, 'sine', 0.15, 0.1);
    playTone(1320, 0.2, 'sine', 0.18, 0.2);
  },

  click: () => {
    playTone(440, 0.05, 'sine', 0.06);
  },

  hint: () => {
    playTone(600, 0.1, 'sine', 0.1);
    playTone(750, 0.15, 'sine', 0.1, 0.08);
  },

  erase: () => {
    playTone(300, 0.08, 'sine', 0.08);
  },

  note: () => {
    playTone(660, 0.06, 'sine', 0.07);
  },

  levelUp: () => {
    const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    melody.forEach((freq, i) => {
      playTone(freq, 0.15, 'sine', 0.15, i * 0.07);
    });
  },

  select: () => {
    playTone(500, 0.04, 'sine', 0.05);
  },

  dailyReward: () => {
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99];
    notes.forEach((freq, i) => {
      playTone(freq, 0.2, 'sine', 0.18, i * 0.09);
    });
  },
};

let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function playSound(name: keyof typeof sounds): void {
  if (!soundEnabled) return;
  sounds[name]();
}

