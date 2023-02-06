const traits = require('./data/traits.js');

module.exports = () => {
  const spectrumColors = traits[0].values.map((trait) => trait.hex);
  // Put all colors into an array
  const spectrumColorsArray = spectrumColors.reduce((acc, curr) => {
    // Return colorA and colorB without the # sign
    return [...acc, curr.colorA.slice(1), curr.colorB.slice(1)];
  }, []);

  const sceneryColors = traits[1].values.map((trait) => trait.hex);
  const sceneryColorsArray = sceneryColors.reduce((acc, curr) => {
    return [...acc, curr.slice(1)];
  }, []);

  return { spectrum: spectrumColorsArray, scenery: sceneryColorsArray };
};
