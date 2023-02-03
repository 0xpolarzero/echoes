const developmentChains = ['hardhat', 'localhost'];

// Attributes
const attributes = {
  spectrum: [
    'Oceanic Blaze, Sunset Haze',
    'Velvet Nightfall, Verdant Whisper',
    'Blushing Petals, Serene Waves',
    'Sunset Symphony, Azure Skies',
    'Celestial Haze, Ethereal Fog',
    'Amber Sunset, Jade Depths',
    'Royal Amethyst, Misty Gray',
    'Gold Sands, Sapphire Dreams',
  ],
  scenery: [
    'Midnight Mystery',
    'Dark Charcoal',
    'Deep Space',
    'Celestial Silver',
    'Ethereal Glow',
    'Dreamy Cloud',
  ],
  trace: [
    'Whirling Vortices',
    'Radiant Blossom',
    'Dancing Fireflies',
    'Celestial Swirl',
    'Spiraling Nebula',
    'Celestial Waltz',
    'Glowing Orbs',
    'Radiant Sun',
  ],
  atmosphere: [
    'Shapeshift',
    'Sky Currents',
    'Crystal Ripples',
    'Arctic Mirage',
    'Void Whispers',
    'Dream Drifts',
    'City Seraph',
    'Abyss',
  ],
};

const maxExpansion = 10_000;

// Base metadata
const description =
  'An enigma of light, figure, and atmosphere, a singular spectrum frozen in time.';
const backgroundColor = '0x101010';
const externalUrl = 'https://';
const animationUrl = 'https://';

module.exports = {
  developmentChains,
  attributes,
  maxExpansion,
  description,
  backgroundColor,
  externalUrl,
  animationUrl,
};
