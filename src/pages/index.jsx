import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Instructions from '@/components/dom/Instructions';

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Entity = dynamic(() => import('@/components/canvas/Entity'), {
  ssr: false,
});

// Dom components go here
export default function Page(props) {
  return <Instructions />;
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <Entity route='/blob' />;

export async function getStaticProps() {
  return { props: { title: 'orbs' } };
}
