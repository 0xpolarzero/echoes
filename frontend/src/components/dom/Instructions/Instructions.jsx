import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
import { getBackground, getGradient } from '@/systems/utils';
import Signature from './Signature';
import Mint from './Mint';
import stores from '@/stores';

export default function Instructions() {
  const { generate } = stores.useConfig();

  const optionsElem = useRef();
  const { options } = stores.useTraits();

  const [current, setCurrent] = useState(0);
  const first = 0;
  const last = options.length + 2; // 2 additional sections

  useEffect(() => {
    // Get to the right section on button click
    // if (!generate) {
    // optionsElem.current.style.transform = `translateY(200%)`;
    // } else {
    optionsElem.current.style.transform = `translateY(-${current * 200}%)`;
    // }
  }, [current]);

  useEffect(() => {
    if (generate) {
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  }, [generate]);

  return (
    <div className='instructions'>
      {/* {audio} */}
      <div ref={optionsElem} className='options'>
        <Home count={0} />
        {options.map((option, index) => {
          return <Section key={index} option={option} count={index + 1} />;
        })}
        <Signature count={last - 1} />
        <Mint count={last} />
      </div>

      <button
        className={`controls prev ${current <= 1 || !generate ? 'hidden' : ''}`}
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
        <span className='emphasize'>interactive</span> collectible.
      </h1>
      <p>
        Each echo is a combination of several creative attributes that shape its
        perceptible experience. These attributes are{' '}
        <span className='emphasize'>stored on-chain</span>, and some can evolve
        over time. The code behind the generation and display of the echoes is{' '}
        <span className='emphasize'>open and transparent</span>, providing full
        visibility to those interested. The attributes include:
      </p>
      <p>
        <span className='emphasize'>spectrum_</span> a combination of 2 colors
        for the particles
        <br />
        <span className='emphasize'>scenery_</span> a background color
        <br />
        <span className='emphasize'>trace_</span> the movement pattern of the
        particles
        <br />
        <span className='emphasize'>atmosphere_</span> an immersive soundscape
        that affects the particles
      </p>
      <p>
        <span className='emphasize'>signature_</span> a distinct name that is
        unique to each echo
      </p>
      <p>
        <span className='emphasize'>expansion_</span> the growth of the echo,
        defining the number of particles, which evolves over time and can be
        enhanced by the owner
      </p>
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
