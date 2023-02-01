import React, { useEffect } from 'react';
import Link from 'next/link';
import { Divider } from 'antd';
import { CiLight, CiDark } from 'react-icons/ci';
import { RxSpeakerLoud, RxSpeakerOff } from 'react-icons/rx';
import stores from '@/stores';

const Nav = () => {
  const { theme, updateTheme } = stores.useTheme();
  const { suspended: audioOff, toggleMute } = stores.useAudio();

  // Put _ before active page

  return (
    <header className='nav'>
      <div className='title'>
        <Link href='/'>celestial_orbs</Link>
      </div>
      <div className='links'>
        <Link href='/'>explore</Link>
        <Divider type='vertical' />
        <Link href='/'>my orbs</Link>
        <Divider type='vertical' />
        {theme === 'dark' ? (
          <CiDark size={20} onClick={() => updateTheme('light')} />
        ) : (
          <CiLight size={20} onClick={() => updateTheme('dark')} />
        )}
        <Divider type='vertical' />
        {audioOff ? (
          <RxSpeakerOff size={20} onClick={toggleMute} />
        ) : (
          <RxSpeakerLoud size={20} onClick={toggleMute} />
        )}
      </div>
    </header>
  );
};

export default Nav;
