/**
 * Audio Alert Service for Emergency Landslide Sirens in Web / PWA
 * Uses Web Audio API (OscillatorNode) with zero external asset dependencies.
 */

let audioCtx: AudioContext | null = null;
let sirenInterval: any = null;
let isSirenPlaying = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a short 2-tone emergency siren burst (or continuous alarm)
 */
export function playEmergencySiren(durationMs: number = 3000): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopEmergencySiren();
    isSirenPlaying = true;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);

    // Modulate pitch between 600Hz and 950Hz (standard disaster siren curve)
    osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.8);
    osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 1.2);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1.6);
    osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 2.0);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 2.4);
    osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 2.8);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (durationMs / 1000));

    setTimeout(() => {
      isSirenPlaying = false;
    }, durationMs);
  } catch (e) {
    console.warn('Web Audio Siren not supported or blocked by user gesture:', e);
  }
}

/**
 * Play a high-frequency warning beep
 */
export function playWarningBeep(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Warning beep error:', e);
  }
}

/**
 * Stop any active audio siren
 */
export function stopEmergencySiren(): void {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  isSirenPlaying = false;
}
