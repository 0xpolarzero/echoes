import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

import vertexShader from './shaders/vertexShader';
import fragmentShader from './shaders/fragmentShader';
import stores from '@/stores';

export default function Creation({ route, ...props }) {
  const router = useRouter();
  const mesh = useRef(null);
  const [hovered, hover] = useState(false);
  const { traits } = stores.useTraits();

  const count = 100;
  const radius = 2;

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
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uColorA: new THREE.Uniform(new THREE.Vector3(...traits.color.colorA)),
      uColorB: new THREE.Uniform(new THREE.Vector3(...traits.color.colorB)),
    }),
    [traits.color.colorA, traits.color.colorB],
  );

  useCursor(hovered);
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // mesh.current.rotation.y = t / 2 + Math.sin(t * 2) / 10;
    // mesh.current.rotation.x = t / 2 + Math.sin(t * 2) / 10;
    // mesh.current.rotation.z = t / 2 + Math.sin(t * 2) / 10;

    mesh.current.material.uniforms.uTime.value = t;
  });

  return (
    <points
      ref={mesh}
      {...props}
      // onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}>
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
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
}
