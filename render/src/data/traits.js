const traits = [
  {
    type: 'spectrum',
    label: 'Spectrum',
    values: [
      {
        // Soothing Skies and Warm Sands
        name: 'Oceanic Blaze, Sunset Haze',
        id: 'oceanicBlazeSunsetHaze',
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
        id: 'velvetNightfallVerdantWhisper',
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
        id: 'blushingPetalsSereneWaves',
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
        id: 'sunsetSymphonyAzureSkies',
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
        id: 'celestialHazeEtherealFog',
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
        id: 'amberSunsetJadeDepths',
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
        id: 'royalAmethystMistyGray',
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
        id: 'goldSandsSapphireDreams',
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
    type: 'scenery',
    label: 'Scenery',
    values: [
      {
        name: 'Midnight Mystery',
        id: 'midnightMystery',
        light: false,
        hex: '#101010',
        rgb: '16, 16, 16',
      },
      {
        name: 'Dark Charcoal',
        id: 'darkCharcoal',
        light: false,
        hex: '#333333',
        rgb: '51, 51, 51',
      },
      {
        name: 'Deep Space',
        id: 'deepSpace',
        light: false,
        hex: '#1C2331',
        rgb: '28, 35, 49',
      },
      {
        name: 'Celestial Silver',
        id: 'celestialSilver',
        light: true,
        hex: '#E5E5E5',
        rgb: '229, 229, 229',
      },
      {
        name: 'Ethereal Glow',
        id: 'etherealGlow',
        light: true,
        hex: '#B2CCD6',
        rgb: '178, 204, 214',
      },
      {
        name: 'Dreamy Cloud',
        id: 'dreamyCloud',
        light: true,
        hex: '#B7CCE2',
        rgb: '183, 204, 226',
      },
    ],
  },
  {
    type: 'trace',
    label: 'Trace',
    values: [
      {
        name: 'Whirling Vortices',
        id: 'whirlingVortices',
      },
      {
        name: 'Radiant Blossom',
        id: 'radiantBlossom',
      },
      {
        name: 'Dancing Fireflies',
        id: 'dancingFireflies',
      },
      {
        name: 'Celestial Swirl',
        id: 'celestialSwirl',
      },
      {
        name: 'Spiraling Nebula',
        id: 'spiralingNebula',
      },
      {
        name: 'Celestial Waltz',
        id: 'celestialWaltz',
      },
      {
        name: 'Glowing Orbs',
        id: 'glowingOrbs',
      },
      {
        name: 'Radiant Sun',
        id: 'radiantSun',
      },
    ],
  },
  {
    type: 'atmosphere',
    label: 'Atmosphere',
    values: [
      {
        name: 'Shapeshift',
        id: 'shapeshift',
      },
      {
        name: 'Sky Currents',
        id: 'skyCurrents',
      },
      {
        name: 'Crystal Ripples',
        id: 'crystalRipples',
      },
      {
        name: 'Arctic Mirage',
        id: 'arcticMirage',
      },
      {
        name: 'Void Whispers',
        id: 'voidWhispers',
      },
      {
        name: 'Dream Drifts',
        id: 'dreamDrifts',
      },
      {
        name: 'City Seraph',
        id: 'citySeraph',
      },
      {
        name: 'Abyss',
        id: 'abyss',
      },
    ],
  },
];

export default traits;
