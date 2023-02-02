import { create } from 'zustand';
import useTraits from './useTraits';
import config from '@/data-config';

const audio = config.find((c) => c.type === 'atmosphere');

export default create((set, get) => ({
  audioContext: null,
  sources: [],
  analyser: null,
  started: false,
  suspended: true,

  /*
   * Audio
   */
  init: () => {
    const { sources, started, createAnalyser } = get();
    if (started) return;

    const audioContext = new AudioContext();

    sources.forEach((ref, index) => {
      // Only play the first one
      if (ref.current) {
        if (index !== 0) ref.current.volume = 0;
        ref.current.play();
      }
    });

    set({ audioContext, started: true, suspended: false });
    createAnalyser();
  },

  reset: () => {
    set({ started: false, suspended: true });
  },

  update: () => {
    const { sources, started, createAnalyser } = get();
    const { traits } = useTraits.getState();
    if (!started) return;

    const index = audio.values.findIndex((v) => v === traits.atmosphere);
    sources.forEach((ref, i) => {
      if (i === index) {
        ref.current.currentTime = 0;
        ref.current.volume = 1;
      } else {
        ref.current.volume = 0;
      }
    });

    createAnalyser();
  },

  toggleMute: () => {
    const { audioContext } = get();

    if (audioContext.state === 'suspended') {
      audioContext.resume();
      set({ suspended: false });
    } else {
      audioContext.suspend();
      set({ suspended: true });
    }
  },

  /*
   * Analyser
   */
  createAnalyser: () => {
    const { audioContext, sources } = get();
    const { traits } = useTraits.getState();
    const index = audio.values.findIndex((v) => v === traits.atmosphere);

    const source = audioContext.createMediaElementSource(
      sources[index].current,
    );
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    set({ analyser });
  },

  getAnalyserData: () => {
    const { audioContext, analyser } = get();
    if (!analyser) return null;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    // Get the gain
    const gain = data.reduce((a, b) => a + b) / data.length;
    // Find the main frequency
    const mainFrequencyIndex = data.indexOf(Math.max(...data));
    const mainFrequencyInHz =
      (mainFrequencyIndex * (audioContext.sampleRate / 2)) /
      analyser.frequencyBinCount;

    return { frequency: mainFrequencyInHz, gain: gain / 255 };
  },
}));
