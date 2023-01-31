import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Instructions from '@/components/dom/Instructions';

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Creation = dynamic(() => import('@/components/canvas/Creation'), {
  ssr: false,
});

// Dom components go here
export default function Page(props) {
  return <Instructions>Instructions</Instructions>;
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
// Find the position needed so it is at the center of the left side of the screen
Page.canvas = (props) => <Creation route='/blob' />;

export async function getStaticProps() {
  return { props: { title: 'Index' } };
}
