import { create } from 'zustand';
import useTraits from './useTraits';
import config from '@/data-config';

const audio = config.find((c) => c.type === 'atmosphere');

export default create((set, get) => ({
  sources: [],
  started: false,
  analysers: [],
  setStarted: (started) => set({ started }),

  /*
   * Audio
   */
  init: () => {
    const { sources, started, setStarted, createAnalysers } = get();
    if (started) return;

    sources.forEach((ref, index) => {
      // Only play the first one
      if (ref.current) {
        if (index !== 0) ref.current.volume = 0;
        ref.current.play();
      }
    });

    setStarted(true);
    createAnalysers(sources);
  },

  update: () => {
    const { sources, started } = get();
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
  },

  /*
   * Analyser
   */
  createAnalysers: () => {
    const { sources, analysers } = get();
    const audioContext = new AudioContext();

    sources.forEach((ref, index) => {
      const source = audioContext.createMediaElementSource(ref.current);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analysers[index] = analyser;
    });
  },

  getAnalyser: (index) => {
    const { analysers } = get();
    if (!analysers[index]) return null;

    const analyser = analysers[index];

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // Find the highest frequency
    const highestFrequency = frequencyData.reduce((prev, curr) =>
      prev > curr ? prev : curr,
    );

    // Get the overall gain
    const overallGain = frequencyData.reduce((prev, curr) => prev + curr, 0);

    return { frequency: highestFrequency, gain: overallGain / 255 };
  },
}));
