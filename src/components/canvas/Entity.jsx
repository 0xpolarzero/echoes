import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

import orbVertexShader from './shaders/orb/vertexShader';
import orbFragmentShader from './shaders/orb/fragmentShader';
import stores from '@/stores';
import hooks from '@/hooks';

const Entity = ({ route, ...props }) => {
  const router = useRouter();
  const group = useRef(null);

  // const [hovered, hover] = useState(false);
  // useCursor(hovered);

  const radius = 2;

  useFrame(({ camera }) => {
    // Make sure the entity is always at the center of the left side of the screen
    group.current.position.x = -1.5 * (window.innerWidth / window.innerHeight);
  });
  return (
    <>
      <group ref={group} position={[-2, 0, 0]} {...props}>
        <Background radius={radius} />
        <Orb radius={radius} />
      </group>
    </>
  );
};

const Orb = ({ radius }) => {
  const mesh = useRef(null);
  const { traits } = stores.useTraits();

  const count = 100;

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
        vertexShader={orbVertexShader}
        fragmentShader={orbFragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

const Background = ({ radius }) => {
  const { traits } = stores.useTraits();
  const { updateTheme } = hooks.useTheme();
  const color = `rgba(${traits.background.rgb}, 0.9)`;

  useEffect(() => {
    // document.querySelector('.container').style.background = color;
    updateTheme(traits.background);
  }, [traits.background.rgb]);

  return null;
  // <Html center prepend>
  //   <div
  //     style={{
  //       position: 'absolute',
  //       width: radius * 200,
  //       height: radius * 200,
  //       top: '50%',
  //       left: '50%',
  //       transform: 'translate(-50%, -50%)',
  //       borderRadius: '50%',

  //       // Fade out the border
  //       // it shoud be filled on the inside, but fade out on the outside
  //       // same but with a custom color
  //       background: `radial-gradient(circle at 50% 50%, ${color} 0%, rgba(var(--background-main-rgb), 0) 100%)`,
  //     }}
  //   />
  // </Html>
};

export default Entity;
