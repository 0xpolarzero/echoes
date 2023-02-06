import { create } from 'zustand';
import config from '@/data';

export default create((set) => ({
  // Get all trait types
  options: config.traits,
  traits: config.traits.reduce(
    (acc, trait) => {
      // Set it to a default value (the first one)
      acc[trait.type] = trait.values[0];
      return acc;
    },
    { expansion: 100, signature: null },
  ),
  // Set a trait type to a specific value
  setTrait: (type, values) => {
    set((state) => {
      const traits = { ...state.traits };
      traits[type] = values;
      return { traits };
    });
  },

  // Create a metadata object given traits (for minting)
  getMetadataFromTraits: (traits) => {
    const traitsFormatted = config.traits.reduce((acc, trait) => {
      const index =
        trait.values.findIndex(
          (value) => value.name === traits[trait.type].name,
        ) || 0;
      acc.push(index);
      return acc;
    }, []);

    return [traits.signature, ...traitsFormatted];
  },

  // Get traits properties given a metadata object
  getTraitsFromMetadata: (metadata) =>
    config.traits.reduce(
      (acc, trait) => {
        const traitData = trait.values.find(
          (value) =>
            value.name.toLowerCase() === metadata[trait.type].toLowerCase(),
        );
        acc[trait.type] = traitData;
        return acc;
      },
      { expansion: metadata.expansion, signature: metadata.signature },
    ),
}));
