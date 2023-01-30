import { Scroll, ScrollControls } from '@react-three/drei';
import React, { forwardRef } from 'react';

const Overlay = ({ caption, scroll }) => {
  return (
    <div
      className='scroll'
      onScroll={(e) => {
        scroll.current =
          e.target.scrollTop / (e.target.scrollHeight - window.innerHeight);
        caption.current.innerText = `${(scroll.current * 100).toFixed()} %`;
      }}
    >
      <Section
        title='headphone'
        content="Headphones are a pair of small loudspeaker drivers worn on or around the head over a user's ears."
      />
      <Section title='another' content='Lorem blabla ipsum' />
      <Section title='test' content='Lorem ipsum' />
      <span className='caption' ref={caption}>
        0.00
      </span>
    </div>
  );
};

const Section = ({ title, content }) => {
  return (
    <div style={{ height: '100vh' }}>
      <div className='dot'>
        <h1>{title}</h1>
        {content}
      </div>
    </div>
  );
};

export default Overlay;
