import { useEffect, useRef, useState } from 'react';
import stores from '@/stores';
import config from '@/data';

const audio = config.traits.find((c) => c.type === 'atmosphere');

const Audio = () => {
  const { traits } = stores.useTraits();
  const { sources, update } = stores.useAudio();

  useEffect(() => {
    update();
  }, [traits.atmosphere.src, update]);

  return (
    <>
      {audio.values.map((value, index) => {
        const ref = useRef();
        sources[index] = ref;

        return (
          <audio
            ref={ref}
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
