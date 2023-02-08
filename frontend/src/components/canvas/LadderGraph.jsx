import { createRef, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Echo from './Echo';
import stores from '@/stores';
import config from '@/data';

import vertexShaders from './shaders/echo/vertexShaders';
import fragmentShader from './shaders/echo/fragmentShader';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const coordinates = config.coordinates[10]; // For placing 10 entities in a circle

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

      ref.current.material.needsUpdate = true;
    });
  });

  useEffect(() => {
    if (!filteredEchoes || !filteredEchoes.length) return;

    refs.current = Array(filteredEchoes.length)
      .fill()
      .map((_, i) => refs.current[i] || createRef());
    console.log(refs.current);

    setIsDisplayReady(true);
  }, [filteredEchoes, getTraitsFromMetadata, setIsDisplayReady]);

  return (
    <>
      <OrbitControls />
      <group>
        {filteredEchoes.length > 0 ? (
          filteredEchoes.map((echo, i) => {
            const position = enlargeRadius(coordinates[i]);
            return (
              <Echo
                key={i}
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
              />
            );
          })
        ) : (
          <mesh>
            <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
            <meshStandardMaterial attach='material' color='hotpink' />
          </mesh>
        )}
      </group>
    </>
  );
};

const enlargeRadius = (coordinates) => {
  const { x, y, z } = coordinates;
  const multiplier = 4;
  return [x * multiplier, y * multiplier, z * multiplier];
};

export default LadderGraph;
