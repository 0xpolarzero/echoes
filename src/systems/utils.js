export const getGradient = ({ colorA, colorB }, hovered) => {
  const colorAFormatted = `rgba(${colorA[0] * 100}, ${colorA[1] * 100}, ${
    colorA[2] * 100
  }, ${hovered ? 0.4 : 0.1})`;
  const colorBFormatted = `rgba(${colorB[0] * 100}, ${colorB[1] * 100}, ${
    colorB[2] * 100
  }, ${hovered ? 0.4 : 0.1})`;

  return {
    gradient: `linear-gradient(90deg, ${colorAFormatted} 0%, ${colorBFormatted} 100%)`,
    shadow: `0 4px 30px rgba(${colorA[0] * 100}, ${colorA[1] * 100}, ${
      colorA[2] * 100
    }, ${hovered ? 0.4 : 0.1})`,
  };
};
