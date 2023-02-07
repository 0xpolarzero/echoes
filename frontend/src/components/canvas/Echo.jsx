import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShaders from './shaders/echo/vertexShaders';
import fragmentShader from './shaders/echo/fragmentShader';
import stores from '@/stores';

const Echo = ({ radius }) => {
  const mesh = useRef(null);
  const { traits } = stores.useTraits();
  const { getAnalyserData } = stores.useAudio();

  const count = traits.expansion || 100;

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const d = Math.sqrt(Math.random() - 0.5) * radius;
      const th = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = d * Math.sin(th) * Math.cos(phi);
      let y = d * Math.sin(th) * Math.sin(phi);
      let z = d * Math.cos(th);

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count, radius]);

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
  useFrame((state, delta) => {
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

    // Time
    const t = state.clock.getElapsedTime();
    mesh.current.material.uniforms.uTime.value = t;

    // Modifications based on audio
    // ? Maybe find a way for speed
    // ? other ideas: radius that would stretch
    const analyserData = getAnalyserData();
    const gainMultiplier = 1 + analyserData?.gain * 5 || 1;
    const freqMultiplier = 1 + analyserData?.frequency / 20000 || 1;
    const speedMultiplier = gainMultiplier * freqMultiplier;
    // Modify scale based on the gain
    mesh.current.material.uniforms.uGain.value = gainMultiplier;
    // as well as the speed
    // mesh.current.material.uniforms.uSpeed.value = speedMultiplier;
    // Modify brightness based on the frequency
    mesh.current.material.uniforms.uBrighten.value = freqMultiplier;
  });

  return (
    <points
      ref={mesh}
      // onClick={() => router.push(route)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={vertexShaders[traits.trace.id]}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default Echo;
