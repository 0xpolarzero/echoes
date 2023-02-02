const fs = require('fs');

const main = () => {
  // 3 sets of 10 words
  const words = {
    1: [
      'Enigma',
      'Serene',
      'Mystique',
      'Arcane',
      'Dreamlike',
      'Ethereal',
      'Celestial',
      'Shadow',
      'Nebula',
      'Cosmic',
    ],
    2: [
      'Whispers',
      'Haze',
      'Oasis',
      'Mystic',
      'Mirage',
      'Silhouette',
      'Aurora',
      'Twilight',
      'Echoes',
      'Enchanted',
    ],
    3: [
      'Spectral',
      'Reflection',
      'Divine',
      'Enchanted',
      'Faerie',
      'Enrapture',
      'Moonlit',
      'Sojourn',
      'Opulence',
      'Starlit',
    ],
  };

  // Form 1000 names with all the possible combinations
  const names = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        names.push(`${words[1][i]} ${words[2][j]} ${words[3][k]}`);
      }
    }
  }

  // Shuffle the names
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  // Write the names to a file as an array of strings
  fs.writeFileSync('names.json', JSON.stringify(names));
};

main();
