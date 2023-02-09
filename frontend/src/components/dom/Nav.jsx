import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Divider, Tooltip } from 'antd';
import { CiLight, CiDark } from 'react-icons/ci';
import { RxPlay, RxSpeakerLoud, RxSpeakerOff } from 'react-icons/rx';
import stores from '@/stores';

const Nav = () => {
  const { theme, updateTheme } = stores.useConfig();
  const { init, started, suspended: audioOff, toggleMute } = stores.useAudio();
  const { generate, setGenerate, activePage, setActivePage } =
    stores.useConfig();
  const router = useRouter();

  const goTo = (page, generate) => {
    setGenerate(generate);

    if (router.pathname.slice(1) === page) return;
    router.push(page);
  };

  useEffect(() => {
    setTimeout(() => {
      if (router.pathname === '/') {
        generate ? setActivePage('') : setActivePage('experience');
      } else {
        setActivePage(router.pathname.slice(1));
      }
    }, 100);
  }, [router.pathname, generate, setActivePage]);

  return (
    <header className='nav'>
      <div className='title'>
        <a onClick={() => goTo('/', false)}>
          echoes
          <span className='emphasize'>
            {activePage === '' && generate
              ? '_experience'
              : activePage === 'explore'
              ? '_explore'
              : activePage === 'expand'
              ? '_expand'
              : ''}
          </span>
        </a>
      </div>

      <div className='links'>
        {/* Pages */}
        <a
          onClick={() => goTo('/', true)}
          className={activePage === '' && generate ? 'emphasize' : 'underline'}>
          _experience
        </a>
        <Divider type='vertical' />
        <a
          onClick={() => goTo('explore', false)}
          className={activePage === 'explore' ? 'emphasize' : ''}>
          _explore
        </a>
        <Divider type='vertical' />
        <a
          onClick={() => goTo('expand', false)}
          className={activePage === 'expand' ? 'emphasize' : ''}>
          _expand
        </a>
        <Divider type='vertical' />
        {/* Icons */}
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
                ? 'Consider playing the soundscape while generating your echo'
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
