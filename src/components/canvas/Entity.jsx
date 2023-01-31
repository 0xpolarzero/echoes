import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

import orbVertexShader from './shaders/orb/vertexShader';
import orbFragmentShader from './shaders/orb/fragmentShader';
import stores from '@/stores';

const Entity = ({ route, ...props }) => {
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
      uColorA: new THREE.Uniform(
        new THREE.Vector3(...traits.color.vec3.colorA),
      ),
      uColorB: new THREE.Uniform(
        new THREE.Vector3(...traits.color.vec3.colorB),
      ),
    }),
    [],
  );

  useCursor(hovered);
  useFrame((state, delta) => {
    // Time
    const t = state.clock.getElapsedTime();
    mesh.current.material.uniforms.uTime.value = t;

    // Colors
    mesh.current.material.uniforms.uColorA.value = new THREE.Vector3(
      ...traits.color.vec3.colorA,
    );
    mesh.current.material.uniforms.uColorB.value = new THREE.Vector3(
      ...traits.color.vec3.colorB,
    );

    // Make sure the orb is always at the center of the left side of the screen
    mesh.current.position.x = -1.5 * (window.innerWidth / window.innerHeight);
  });

  return (
    <points
      ref={mesh}
      position={[-2, 0, 0]}
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
        vertexShader={orbVertexShader}
        fragmentShader={orbFragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default Entity;
