import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import Echo from './Echo';
import stores from '@/stores';
import config from '@/data';

import vertexShaders from './shaders/echo/vertexShaders';
import fragmentShader from './shaders/echo/fragmentShader';
import { Html, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const LadderGraph = () => {
  const { filteredEchoes, setIsDisplayReady } = stores.useGraph((state) => ({
    filteredEchoes: state.filteredEchoes,
    setIsDisplayReady: state.setIsDisplayReady,
  }));
  const getTraitsFromMetadata = stores.useTraits(
    (state) => state.getTraitsFromMetadata,
  );
  const updateTheme = stores.useConfig((state) => state.updateTheme);
  const { getAnalyserData, updateAudio } = stores.useAudio((state) => ({
    getAnalyserData: state.getAnalyserData,
    updateAudio: state.update,
  }));

  const [target, setTarget] = useState(null);
  const [targetPosition, setTargetPosition] = useState([0, 0, 4]);
  const [info, setInfo] = useState(null);

  const refs = useRef([]);
  const radius = 2;

  // useSpring to animate the group position
  const { position: groupPosition } = useSpring({
    position: target ? targetPosition : [0, 0, -2],
    config: { mass: 1, tension: 100 /* 200 */, friction: 20 },
  });

  const onClick = (echo, position, index) => {
    setTarget(index + 1);
    setTargetPosition([-position[0], -position[1], 0]);
    updateTheme(echo.attributes.scenery);
    updateAudio(echo.attributes.atmosphere);
  };

  const onMissed = () => {
    setTarget(null);
    // setTargetPosition([0, 0, 4]);
    setInfo(null);
  };

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

    setTarget(null);
    setInfo(null);

    setIsDisplayReady(true);
  }, [filteredEchoes, getTraitsFromMetadata, setIsDisplayReady]);

  return filteredEchoes.length > 0 ? (
    <animated.group position={groupPosition}>
      <OrbitControls />
      {filteredEchoes.map((echo, i) => {
        const position = enlargeRadius(i, filteredEchoes.length);

        // ! It is VERY important to set a key that will change each time echoes are filtered
        // ! Otherwise, it won't update the ref as it was already set with the key before
        // ! So the Echo won't get its uniforms updated
        const uniqueKey = i + new Date().getTime(); // This is unique
        // key={echo.chainId + echo.tokenId} // This won't work because the key won't always change

        return (
          <group key={i}>
            <Echo
              key={uniqueKey}
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
              visible={target ? target === i + 1 : true}
            />
            <mesh
              position={position}
              onClick={() => onClick(echo, position, i)}
              onPointerMissed={onMissed}>
              <sphereBufferGeometry attach='geometry' args={[1, 8, 8]} />
              <meshBasicMaterial attach='material' transparent opacity={0} />
            </mesh>
          </group>
        );
      })}
    </animated.group>
  ) : (
    <mesh>
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <meshStandardMaterial attach='material' color='hotpink' />
    </mesh>
  );
};

const enlargeRadius = (index, amount) => {
  const { x, y } = config.coordinates[amount][index];
  const multiplier = 5;
  return [x * multiplier, y * multiplier, 0];
};

export default LadderGraph;
