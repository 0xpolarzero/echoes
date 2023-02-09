import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import Echo from './Echo';
import stores from '@/stores';
import config from '@/data';

import vertexShaders from './shaders/echo/vertexShaders';
import fragmentShader from './shaders/echo/fragmentShader';
import { Html, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const LadderGraph = () => {
  const { filteredEchoes, setIsDisplayReady } = stores.useGraph();
  const { getTraitsFromMetadata } = stores.useTraits();
  const { getAnalyserData } = stores.useAudio();

  const refs = useRef([]);

  const radius = 2;

  useFrame((state) => {
    if (!refs.current || !refs.current.length) return;

    // Modifications based on audio
    const analyserData = getAnalyserData();
    const gainMultiplier = 1 + analyserData?.gain * 5 || 1;
    const freqMultiplier = 1 + analyserData?.frequency / 20000 || 1;

    refs.current.forEach((ref) => {
      if (!ref.current) return;
      // Time
      ref.current.material.uniforms.uTime.value = state.clock.getElapsedTime();

      // Modify scale based on the gain
      ref.current.material.uniforms.uGain.value = gainMultiplier;
      // as well as the brightness
      ref.current.material.uniforms.uBrighten.value = freqMultiplier;
    });
  });

  useEffect(() => {
    if (!filteredEchoes || !filteredEchoes.length) return;

    refs.current = Array(filteredEchoes.length)
      .fill()
      .map((_, i) => refs.current[i] || createRef());
    // But the issue here is that when updating filteredEchoes, refs.current at the
    // indexes that were previously occupied by the removed echoes are not
    // updated. So, when the user clicks on an echo, the ref that is used to
    // access the echo's userData is not the correct one.

    setIsDisplayReady(true);
  }, [filteredEchoes, getTraitsFromMetadata, setIsDisplayReady]);

  return (
    <>
      <OrbitControls />
      {filteredEchoes.length > 0 ? (
        filteredEchoes.map((echo, i) => {
          const position = enlargeRadius(i, filteredEchoes.length);
          return (
            <Echo
              // ! It is VERY important to set a key that will change each time echoes are filtered
              // ! Otherwise, it won't update the ref as it was already set with the key before
              // ! So the Echo won't get its uniforms updated
              // key={echo.chainId + echo.tokenId} // This won't work because the key won't always change
              key={i + new Date().getTime()} // This is unique
              ref={refs.current[i]}
              radius={radius}
              uniforms={{
                uTime: { value: 0.0 },
                uRadius: { value: radius },
                uColorA: new THREE.Uniform(
                  new THREE.Vector3(...echo.attributes.spectrum.vec3.colorA),
                ),
                uColorB: new THREE.Uniform(
                  new THREE.Vector3(...echo.attributes.spectrum.vec3.colorB),
                ),
                uGain: { value: 1.0 },
                uBrighten: { value: 1.0 },
              }}
              count={echo.particlesCount.toFixed()}
              vertexShader={vertexShaders[echo.attributes.trace.id]}
              fragmentShader={fragmentShader}
              position={position}
              userData={echo}
            />
          );
        })
      ) : (
        <mesh>
          <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
          <meshStandardMaterial attach='material' color='hotpink' />
        </mesh>
      )}
    </>
  );
};

const enlargeRadius = (index, amount) => {
  const { x, y, z } = config.coordinates[amount][index];
  const multiplier = 4;
  return [x * multiplier, y * multiplier, z * multiplier];
};

export default LadderGraph;
