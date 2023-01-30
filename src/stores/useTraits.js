import { create } from 'zustand';
import { traits as options } from '@/data-config';

export default create((set) => ({
  // Get all trait types
  options,
  traits: options.reduce((acc, trait) => {
    // Set it to a default value (the first one)
    acc[trait.type] = trait.values[0];
    return acc;
  }, {}),
  // Set a trait type to a specific value
  setTrait: (type, values) => {
    set((state) => {
      const traits = { ...state.traits };
      traits[type] = values;
      return { traits };
    });
  },
}));
