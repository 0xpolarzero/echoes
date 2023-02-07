const getTraits = require('./scripts/getTraits');

const developmentChains = ['hardhat', 'localhost'];
const testnetChains = [5, 80001, 421613];

// Attributes
const attributes = [
  [
    'Oceanic Blaze, Sunset Haze',
    'Velvet Nightfall, Verdant Whisper',
    'Blushing Petals, Serene Waves',
    'Sunset Symphony, Azure Skies',
    'Celestial Haze, Ethereal Fog',
    'Amber Sunset, Jade Depths',
    'Royal Amethyst, Misty Gray',
    'Gold Sands, Sapphire Dreams',
  ],
  [
    'Midnight Mystery',
    'Dark Charcoal',
    'Deep Space',
    'Celestial Silver',
    'Ethereal Glow',
    'Dreamy Cloud',
  ],
  [
    'Whirling Vortices',
    'Radiant Blossom',
    'Dancing Fireflies',
    'Celestial Swirl',
    'Spiraling Nebula',
    'Celestial Waltz',
    'Glowing Orbs',
    'Radiant Sun',
  ],
  [
    'Shapeshift',
    'Sky Currents',
    'Crystal Ripples',
    'Arctic Mirage',
    'Void Whispers',
    'Dream Drifts',
    'City Seraph',
    'Abyss',
  ],
];

// ERC721
const name = 'Echoes';
const symbol = 'ECHO';
const maxSupply = 1_000;
const maxSupplyMock = 10;
const price = ethers.utils.parseEther('0.01');
const mintLimit = 0;

// Base metadata
const description =
  'An enigma of light, figure, and atmosphere, a singular spectrum frozen in time.';
const externalUrl = 'https://orbs-nu.vercel.app/';
const animationUrl = 'https://orbs-4iry.vercel.app';
const { spectrum: spectrumColors, scenery: sceneryColors } = getTraits();

// OpenSea
const contractUri = {
  name,
  description,
  image: '',
  external_link: '',
  seller_fee_basis_points: 1000,
  fee_recipient: process.env.FEE_RECIPIENT,
};
const encodedContractUri =
  'data:application/json;base64,' +
  Buffer.from(JSON.stringify(contractUri)).toString('base64');

// Systems
const expansionCooldown = 60 * 60 * 24;

const BASE_EXPANSE = 100;
const MAX_EXPANSION = 10_000;

module.exports = {
  developmentChains,
  testnetChains,
  attributes,
  spectrumColors,
  sceneryColors,
  name,
  symbol,
  maxSupply,
  maxSupplyMock,
  price,
  mintLimit,
  description,
  externalUrl,
  animationUrl,
  encodedContractUri,
  expansionCooldown,
  BASE_EXPANSE,
  MAX_EXPANSION,
};
