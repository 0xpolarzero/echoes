import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import stores from '@/stores';

const Echo = forwardRef(
  (
    { radius, uniforms, count, vertexShader, fragmentShader, position },
    ref,
  ) => {
    const { getAnalyserData } = stores.useAudio();

    const localRef = useRef();
    useImperativeHandle(ref, () => localRef.current);

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

    useFrame((state) => {
      if (!localRef.current) return;

      // Time
      const t = state.clock.getElapsedTime();
      localRef.current.material.uniforms.uTime.value = t;

      // Modifications based on audio
      const analyserData = getAnalyserData();
      const gainMultiplier = 1 + analyserData?.gain * 5 || 1;
      const freqMultiplier = 1 + analyserData?.frequency / 20000 || 1;
      // Modify scale based on the gain
      localRef.current.material.uniforms.uGain.value = gainMultiplier;
      // as well as the brightness
      localRef.current.material.uniforms.uBrighten.value = freqMultiplier;
    });

    return (
      <points ref={localRef} position={position}>
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
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </points>
    );
  },
);
Echo.displayName = 'Echo';

export default Echo;
