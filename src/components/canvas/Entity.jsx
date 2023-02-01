import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShaders from './shaders/orb/vertexShaders';
import fragmentShader from './shaders/orb/fragmentShader';
import stores from '@/stores';

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
  const { getAnalyser } = stores.useAudio();

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

  let vertex;
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

    // Vertex shader (pattern)
    mesh.current.material.vertexShader =
      vertexShaders[traits.pattern.identifier];
    if (mesh.current.material.vertexShader !== vertex) {
      // Force update if it's been changed
      mesh.current.material.needsUpdate = true;
      vertex = vertexShaders[traits.pattern.identifier];
    }

    // Add multiplier to time based on audio
    // Higher frequency = faster
    console.log(getAnalyser(1));
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
        vertexShader={vertexShaders[traits.pattern.identifier]}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

const Background = ({ radius }) => {
  const { traits } = stores.useTraits();
  const { updateTheme } = stores.useTheme();

  useEffect(() => {
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
