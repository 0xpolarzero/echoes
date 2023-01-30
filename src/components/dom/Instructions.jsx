import stores from '@/stores';
import { useEffect } from 'react';

export default function Instructions({ children }) {
  const { traits, options, setTrait } = stores.useTraits();
  const colorOptions = options.find((option) => option.type === 'color').values;

  useEffect(() => {
    console.log(traits);
  }, [traits]);

  return (
    <div className='instructions'>
      <h1>Choose a color</h1>
      <div className='color-picker'>
        {colorOptions.map((color, index) => (
          <button
            key={index}
            className={`color-option-${index} ${
              traits.color === color ? 'selected' : ''
            }`}
            onClick={() => setTrait('color', color)}>
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
