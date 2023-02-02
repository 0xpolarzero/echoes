import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Divider, Tooltip } from 'antd';
import { CiLight, CiDark } from 'react-icons/ci';
import { RxPlay, RxSpeakerLoud, RxSpeakerOff } from 'react-icons/rx';
import stores from '@/stores';

const Nav = () => {
  const { theme, updateTheme } = stores.useTheme();
  const { init, started, suspended: audioOff, toggleMute } = stores.useAudio();
  const { generate, setGenerate } = stores.useConfig();
  const router = useRouter();

  // Put _ before active page

  const goTo = (page, generate) => {
    setGenerate(generate);
    router.push(page);
  };

  return (
    <header className='nav'>
      <div className='title'>
        <a onClick={() => goTo('/', false)}>celestial-orbs</a>
      </div>
      <div className='links'>
        <a onClick={() => goTo('/', true)}>generate</a>
        <Divider type='vertical' />
        <a onClick={() => goTo('explore', false)}>explore</a>
        <Divider type='vertical' />
        <a onClick={() => goTo('my-orbs', false)}>my orbs</a>
        <Divider type='vertical' />
        {theme === 'dark' ? (
          <CiDark size={20} onClick={() => updateTheme('light')} />
        ) : (
          <CiLight size={20} onClick={() => updateTheme('dark')} />
        )}
        <Divider type='vertical' />
        {started ? (
          audioOff ? (
            <RxSpeakerOff size={20} onClick={toggleMute} />
          ) : (
            <RxSpeakerLoud size={20} onClick={toggleMute} />
          )
        ) : (
          <Tooltip
            title={
              generate
                ? 'Consider playing the soundscape while generating your orb'
                : ''
            }
            color='var(--text-link)'
            defaultOpen
            placement='bottomRight'>
            <RxPlay size={20} onClick={init} />
          </Tooltip>
        )}
      </div>
    </header>
  );
};

export default Nav;
