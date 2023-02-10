import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Expand from '@/components/dom/Expand';

const LadderGraph = dynamic(() => import('@/components/canvas/LadderGraph'), {
  ssr: false,
});

export default function Page(props) {
  return <Expand />;
}

Page.canvas = (props) => <LadderGraph />;

export async function getStaticProps() {
  return { props: { title: 'expand' } };
}
