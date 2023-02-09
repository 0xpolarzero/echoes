import { createRef, useEffect, useRef, useState } from 'react';
import stores from '@/stores';
import config from '@/data';

const audio = config.traits.find((c) => c.type === 'atmosphere');

const Audio = () => {
  const traits = stores.useTraits((state) => state.traits);
  const { setSources, update } = stores.useAudio((state) => ({
    setSources: state.setSources,
    update: state.update,
  }));

  const refs = useRef([]);

  useEffect(() => {
    update();
  }, [traits.atmosphere.src, update]);

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
