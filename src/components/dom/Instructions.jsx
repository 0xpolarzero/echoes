import { useEffect, useState } from 'react';
import stores from '@/stores';

export default function Instructions({ children }) {
  const { traits, options, setTrait } = stores.useTraits();
  const colorOptions = options.find((option) => option.type === 'color').values;

  const [hovered, hover] = useState('');

  useEffect(() => {
    console.log(traits);
  }, [traits]);

  return (
    <div className='instructions'>
      <h1>_color</h1>
      <div className='color-picker'>
        {colorOptions.map((color, index) => {
          const selected = traits.color === color;
          return (
            <button
              key={index}
              className={`color-option-${index} ${selected ? 'selected' : ''}`}
              onPointerEnter={() => hover(color.name)}
              onPointerLeave={() => hover('')}
              style={{
                background: getGradient(
                  color,
                  selected ? true : hovered === color.name,
                ).gradient,
                textTransform: 'lowercase',
              }}
              onClick={() => setTrait('color', color)}>
              {color.name.replace(', ', ' - ')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const getGradient = ({ colorA, colorB }, hovered) => {
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
