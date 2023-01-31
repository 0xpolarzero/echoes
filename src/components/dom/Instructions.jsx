import { useEffect, useState } from 'react';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
import stores from '@/stores';
import { getGradient } from '@/systems/utils';

export default function Instructions({ children }) {
  const { options } = stores.useTraits();
  const [current, setCurrent] = useState(0);
  const last = options.length - 1;

  return (
    <div className='instructions'>
      <div className='options'>
        {options.map((option, index) => {
          return <Section key={index} option={option} />;
        })}
      </div>

      <button
        className='controls prev'
        onClick={() => setCurrent(current === 0 ? 0 : current - 1)}>
        <MdOutlineKeyboardArrowUp size={20} />
      </button>

      <button
        className='controls next'
        onClick={() => setCurrent(current === last ? last : current + 1)}>
        <MdOutlineKeyboardArrowDown size={20} />
      </button>
    </div>
  );
}

const Section = ({ option }) => {
  const { traits, setTrait } = stores.useTraits();
  const [hovered, hover] = useState('');

  return (
    <div className='section'>
      <h1>_{option.type}</h1>
      <div className={`option-picker ${option.type}`}>
        {option.values.map((value, index) => {
          const selected = traits[option.type] === value;

          return (
            <button
              key={index}
              className={`option-${index} ${selected ? 'selected' : ''}`}
              onPointerEnter={() => hover(value)}
              onPointerLeave={() => hover('')}
              style={{
                background:
                  option.type === 'color'
                    ? getGradient(value, selected ? true : hovered === value)
                        .gradient
                    : '',
                textTransform: 'lowercase',
              }}
              onClick={() => setTrait(option.type, value)}>
              {value.name.replace(', ', ' - ')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
