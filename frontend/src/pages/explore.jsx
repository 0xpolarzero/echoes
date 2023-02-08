import React, { useState, useEffect, startTransition } from 'react';
import dynamic from 'next/dynamic';
import Explore from '@/components/dom/Explore';

const LadderGraph = dynamic(() => import('@/components/canvas/LadderGraph'), {
  ssr: false,
});

// Dom components go here
export default function Page(props) {
  return <Explore />;
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <LadderGraph />;

export async function getStaticProps() {
  return { props: { title: 'explore' } };
}
