export const getGradient = ({ colorA, colorB }, highlight) => {
  const colorAFormatted = `rgba(${colorA}, ${highlight ? 0.4 : 0.1})`;
  const colorBFormatted = `rgba(${colorB}, ${highlight ? 0.4 : 0.1})`;

  return {
    gradient: `linear-gradient(90deg, ${colorAFormatted} 0%, ${colorBFormatted} 100%)`,
    shadow: `0 4px 30px rgba(${colorA}, ${highlight ? 0.4 : 0.1})`,
  };
};

export const getBackground = ({ rgb: color }, highlight) => {
  const colorFormatted = `rgba(${color}, ${highlight ? 0.4 : 0.1})`;

  return {
    background: colorFormatted,
    shadow: `0 4px 30px rgba(${color}, ${highlight ? 0.4 : 0.1})`,
  };
};
