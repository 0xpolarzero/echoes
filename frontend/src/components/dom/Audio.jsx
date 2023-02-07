import { useEffect, useRef, useState } from 'react';
import stores from '@/stores';
import config from '@/data';

const audio = config.traits.find((c) => c.type === 'atmosphere');

const Audio = () => {
  const { traits } = stores.useTraits();
  const { sources, update } = stores.useAudio();

  const refs = useRef([]);

  useEffect(() => {
    update();
  }, [traits.atmosphere.src, update]);

  useEffect(() => {
    refs.current = refs.current.slice(0, audio.values.length);
  }, []);

  return (
    <>
      {audio.values.map((value, index) => {
        sources[index] = refs.current[index];

        return (
          <audio
            ref={(ref) => (refs.current[index] = ref)}
            key={index}
            src={value.src}
            loop
            preload='none'
            crossOrigin='anonymous'
          />
        );
      })}
    </>
  );
};

export default Audio;
