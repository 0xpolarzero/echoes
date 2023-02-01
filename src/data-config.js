export const traits = [
  {
    type: 'color',
    label: 'Color',
    values: [
      {
        // Soothing Skies and Warm Sands
        name: 'Oceanic Blaze, Sunset Haze',
        vec3: {
          colorA: [0.34, 0.53, 0.96],
          colorB: [0.97, 0.7, 0.45],
        },
        rgb: {
          colorA: '87, 136, 245',
          colorB: '248, 179, 115',
        },
      },

      {
        name: 'Velvet Nightfall, Verdant Whisper',
        vec3: {
          colorA: [0.93, 0.8, 0.95],
          colorB: [0.58, 0.92, 0.67],
        },
        rgb: {
          colorA: '237, 204, 241',
          colorB: '148, 235, 170',
        },
      },
      {
        name: 'Blushing Petals, Serene Waves',
        vec3: {
          colorA: [0.97, 0.87, 0.89],
          colorB: [0.65, 0.86, 0.97],
        },
        rgb: {
          colorA: '248, 221, 227',
          colorB: '166, 220, 247',
        },
      },

      {
        name: 'Sunset Symphony, Azure Skies',
        vec3: {
          colorA: [0.71, 0.49, 0.9],
          colorB: [0.17, 0.51, 0.95],
        },
        rgb: {
          colorA: '181, 125, 230',
          colorB: '43, 130, 242',
        },
      },
      {
        name: 'Celestial Haze, Ethereal Fog',
        vec3: {
          colorA: [0.78, 0.38, 0.8],
          colorB: [0.53, 0.53, 0.53],
        },
        rgb: {
          colorA: '199, 97, 204',
          colorB: '136, 136, 136',
        },
      },
      {
        name: 'Amber Sunset, Jade Depths',
        vec3: {
          colorA: [0.97, 0.84, 0.37],
          colorB: [0.1, 0.47, 0.45],
        },
        rgb: {
          colorA: '247, 214, 94',
          colorB: '25, 119, 114',
        },
      },
      {
        name: 'Royal Amethyst, Misty Gray',
        vec3: {
          colorA: [0.69, 0.33, 0.96],
          colorB: [0.84, 0.84, 0.84],
        },
        rgb: {
          colorA: '176, 84, 245',
          colorB: '215, 215, 215',
        },
      },
      {
        name: 'Gold Sands, Sapphire Dreams',
        vec3: {
          colorA: [0.88, 0.65, 0.24],
          colorB: [0.27, 0.56, 0.84],
        },
        rgb: {
          colorA: '224, 166, 61',
          colorB: '69, 143, 214',
        },
      },
    ],
  },
  {
    type: 'background',
    label: 'Background',
    values: [
      {
        name: 'Midnight Mystery',
        short: 'midnight',
        light: false,
        hex: '#101010',
        rgb: '16, 16, 16',
      },
      {
        name: 'Dark Charcoal',
        short: 'charcoal',
        light: false,
        hex: '#333333',
        rgb: '51, 51, 51',
      },
      {
        name: 'Deep Space',
        short: 'space',
        light: false,
        hex: '#1C2331',
        rgb: '28, 35, 49',
      },
      {
        name: 'Celestial Silver',
        short: 'silver',
        light: true,
        hex: '#E5E5E5',
        rgb: '229, 229, 229',
      },
      {
        name: 'Ethereal Glow',
        short: 'glow',
        light: true,
        hex: '#B2CCD6',
        rgb: '178, 204, 214',
      },
      {
        name: 'Dreamy Cloud',
        short: 'cloud',
        light: true,
        hex: '#B7CCE2',
        rgb: '183, 204, 226',
      },
    ],
  },
  {
    type: 'pattern',
    label: 'Pattern',
    values: [
      {
        name: 'Whirling Vortices',
        identifier: 'whirlingVortices',
      },
      {
        name: 'Radiant Blossom',
        identifier: 'radiantBlossom',
      },
      {
        name: 'Dancing Fireflies',
        identifier: 'dancingFireflies',
      },
      {
        name: 'Celestial Swirl',
        identifier: 'celestialSwirl',
      },
      {
        name: 'Spiraling Nebula',
        identifier: 'spiralingNebula',
      },
      {
        name: 'Celestial Waltz',
        identifier: 'celestialWaltz',
      },
      {
        name: 'Glowing Orbs',
        identifier: 'glowingOrbs',
      },
      {
        name: 'Radiant Sun',
        identifier: 'radiantSun',
      },
    ],
  },
  {
    type: 'atmosphere',
    label: 'Atmosphere',
    path: '@/assets/audio/',
    extension: '.mp3',
    values: [
      {
        name: 'Shapeshift',
        identifier: 'celestial_orbs_sfx-001',
      },
      {
        name: 'Sky Currents',
        identifier: 'celestial_orbs_sfx-002',
      },
      {
        name: 'Crystal Ripples',
        identifier: 'celestial_orbs_sfx-003',
      },
      {
        name: 'Arctic Mirage',
        identifier: 'celestial_orbs_sfx-004',
      },
      {
        name: 'Void Whispers',
        identifier: 'celestial_orbs_sfx-005',
      },
      {
        name: 'Dream Drifts',
        identifier: 'celestial_orbs_sfx-006',
      },
      {
        name: 'City Seraph',
        identifier: 'celestial_orbs_sfx-007',
      },
      {
        name: 'Abyss',
        identifier: 'celestial_orbs_sfx-008',
      },
    ],
  },
];
