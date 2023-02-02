import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
import { getBackground, getGradient } from '@/systems/utils';
import Signature from './Signature';
import Mint from './Mint';
import Audio from './Audio';
import stores from '@/stores';

export default function Instructions() {
  const { generate } = stores.useConfig();
  const { reset } = stores.useAudio();

  const optionsElem = useRef();
  const { options } = stores.useTraits();

  const [current, setCurrent] = useState(0);
  const first = 0;
  const last = options.length + 1;

  const audio = useMemo(() => {
    return <Audio />;
  }, []);

  useEffect(() => {
    // Get to the right section on button click
    if (!generate) {
      optionsElem.current.style.transform = `translateY(200%)`;
    } else {
      optionsElem.current.style.transform = `translateY(-${current * 200}%)`;
    }
  }, [current, generate]);

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className='instructions'>
      {audio}
      <div ref={optionsElem} className='options'>
        <Home count={first - 1} />
        {options.map((option, index) => {
          return <Section key={index} option={option} count={index} />;
        })}
        <Signature count={last - 1} />
        <Mint count={last} />
      </div>

      <button
        className={`controls prev ${current <= 0 || !generate ? 'hidden' : ''}`}
        onClick={() => setCurrent(current === 0 ? 0 : current - 1)}>
        <MdOutlineKeyboardArrowUp size={20} />
      </button>

      <button
        className={`controls next ${
          current === last || !generate ? 'hidden' : ''
        }`}
        onClick={() => setCurrent(current === last ? last : current + 1)}>
        <MdOutlineKeyboardArrowDown size={20} />
      </button>
    </div>
  );
}

const Home = ({ count }) => {
  return (
    <div className='section home' style={{ top: `${count * 200}%` }}>
      <h1>
        A <span className='emphasize'>contemplative</span> yet{' '}
        <span className='emphasize'>interactive</span> (kind of){' '}
        <span className='emphasize'>fully on-chain</span> collectible.
      </h1>
      <p>Each orb is a combination of multiple creative attributes.</p>
      <p>
        <span className='emphasize'>spectrum</span> _an association of 2 colors
        for the particles
        <br />
        <span className='emphasize'>scenery</span> _a background color
        <br />
        <span className='emphasize'>trace</span> _the movement pattern of the
        particles
        <br />
        <span className='emphasize'>atmosphere</span> _a soundscape that affects
        the particles
      </p>
      <p>
        <span className='emphasize'>signature</span> _a unique name for your orb
      </p>
      + count
    </div>
  );
};

const Section = ({ option, count }) => {
  const { traits, setTrait } = stores.useTraits();
  const [hovered, hover] = useState('');

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
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
                  option.type === 'spectrum'
                    ? getGradient(
                        value.rgb,
                        selected ? true : hovered === value,
                      ).gradient
                    : option.type === 'scenery'
                    ? getBackground(value, selected ? true : hovered === value)
                        .background
                    : null,
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
