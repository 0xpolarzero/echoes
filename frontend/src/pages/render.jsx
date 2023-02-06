import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Render = dynamic(() => import('@/components/canvas/Render'), {
  ssr: false,
});

// Dom components go here
export default function Page(props) {
  return null;
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <Render />;

export async function getStaticProps() {
  return { props: { title: 'orbs' } };
}
