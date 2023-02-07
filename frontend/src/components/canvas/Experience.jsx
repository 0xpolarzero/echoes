import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Echo from './Echo';
import stores from '@/stores';

const Experience = ({ ...props }) => {
  const { traits } = stores.useTraits();
  const { updateTheme } = stores.useConfig();
  const group = useRef(null);

  // Pass traits to echo and that should be it
  // Maybe also a position

  const radius = 2;

  useFrame(({ camera }) => {
    // Make sure the entity is always at the center of the left side of the screen
    group.current.position.x = -1.5 * (window.innerWidth / window.innerHeight);
  });

  useEffect(() => {
    updateTheme(traits.scenery);
  }, [traits.scenery, updateTheme]);

  return (
    <>
      <group ref={group} position={[-2, 0, 0]} {...props}>
        <Echo radius={radius} />
      </group>
    </>
  );
};

export default Experience;
