import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Echo from './Echo';
import stores from '@/stores';

import vertexShaders from './shaders/echo/vertexShaders';
import fragmentShader from './shaders/echo/fragmentShader';

const Experience = ({ ...props }) => {
  const traits = stores.useTraits((state) => state.traits);
  const updateTheme = stores.useConfig((state) => state.updateTheme);
  const getAnalyserData = stores.useAudio((state) => state.getAnalyserData);
  const group = useRef(null);
  const mesh = useRef(null);

  const radius = 2;

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
      uColorA: new THREE.Uniform(
        new THREE.Vector3(...traits.spectrum.vec3.colorA),
      ),
      uColorB: new THREE.Uniform(
        new THREE.Vector3(...traits.spectrum.vec3.colorB),
      ),
      uGain: {
        value: 1.0,
      },
      uBrighten: {
        value: 1.0,
      },
    }),
    [radius],
  );

  let vertex;
  useFrame((state) => {
    if (!mesh.current) return;

    // Time
    const t = state.clock.getElapsedTime();
    mesh.current.material.uniforms.uTime.value = t;

    // Colors
    mesh.current.material.uniforms.uColorA.value = new THREE.Vector3(
      ...traits.spectrum.vec3.colorA,
    );
    mesh.current.material.uniforms.uColorB.value = new THREE.Vector3(
      ...traits.spectrum.vec3.colorB,
    );

    // Vertex shader (pattern)
    mesh.current.material.vertexShader = vertexShaders[traits.trace.id];
    if (mesh.current.material.vertexShader !== vertex) {
      // Force update if it's been changed
      mesh.current.material.needsUpdate = true;
      vertex = vertexShaders[traits.trace.id];
    }

    // Modifications based on audio
    const analyserData = getAnalyserData();
    const gainMultiplier = 1 + analyserData?.gain * 5 || 1;
    const freqMultiplier = 1 + analyserData?.frequency / 20000 || 1;
    // Modify scale based on the gain
    mesh.current.material.uniforms.uGain.value = gainMultiplier;
    // as well as the brightness
    mesh.current.material.uniforms.uBrighten.value = freqMultiplier;

    // Make sure the entity is always at the center of the left side of the screen
    group.current.position.x = -1.5 * (window.innerWidth / window.innerHeight);
  });

  useEffect(() => {
    updateTheme(traits.scenery);
  }, [traits.scenery, updateTheme]);

  return (
    <>
      <group ref={group} position={[-2, 0, 0]} {...props}>
        <Echo
          ref={mesh}
          radius={radius}
          uniforms={uniforms}
          count={traits.expansion || 100}
          vertexShader={vertexShaders[traits.trace.id]}
          fragmentShader={fragmentShader}
          position={[0, 0, 0]}
        />
      </group>
    </>
  );
};

export default Experience;
