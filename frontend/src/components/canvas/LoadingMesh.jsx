import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const LoadingMesh = () => {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.cos(t * 1);
    ref.current.material.opacity = 0.3 + 0.4 * Math.sin(t * 2);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry attach='geometry' args={[0.5, 32, 32]} />
      <meshStandardMaterial
        attach='material'
        color='#646cff'
        wireframe
        transparent
      />
    </mesh>
  );
};

export default LoadingMesh;
