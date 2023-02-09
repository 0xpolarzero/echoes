import { createRef, useEffect, useRef, useState } from 'react';
import stores from '@/stores';
import config from '@/data';

const audio = config.traits.find((c) => c.type === 'atmosphere');

const Audio = () => {
  const setSources = stores.useAudio((state) => state.setSources);

  const refs = useRef([]);

  useEffect(() => {
    refs.current = Array(audio.values.length)
      .fill()
      .map((_, i) => refs.current[i] || createRef());
    setSources(refs.current);
  }, [setSources]);

  return (
    <>
      {audio.values.map((value, i) => {
        // sources[i] = refs.current[i];
        // console.log(sources)

        return (
          <audio
            ref={refs.current[i]}
            key={i}
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
