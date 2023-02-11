import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

export default function Scene({ children, ...props }) {
  return (
    <Canvas {...props} camera={{ position: [0, 0, 4], fov: 75 }}>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      {children}
      <Preload all />
    </Canvas>
  );
}
