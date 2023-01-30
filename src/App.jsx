import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Overlay from './components/Overlay';

function App() {
  const scroll = useRef(0);
  const caption = useRef(null);

  return (
    <>
      <Canvas
        shadows
        eventSource={document.querySelector('#root')}
        eventPrefix='client'
      >
        <ambientLight intensity={0.5} />
      </Canvas>
      <Overlay caption={caption} scroll={scroll} />
    </>
  );
}

export default App;
