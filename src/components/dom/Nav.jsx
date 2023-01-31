import React, { useEffect } from 'react';
import Link from 'next/link';
import { Divider } from 'antd';
import { CiLight, CiDark } from 'react-icons/ci';
import hooks from '@/hooks';

const Nav = ({ layoutRef, setLocalTheme }) => {
  const { theme, setTheme } = hooks.useTheme();

  useEffect(() => {
    layoutRef.current.classList.remove(theme === 'dark' ? 'light' : 'dark');
    layoutRef.current.classList.add(theme);
    setLocalTheme(theme);
  }, [theme]);

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
          <CiDark size={20} onClick={() => setTheme('light')} />
        ) : (
          <CiLight size={20} onClick={() => setTheme('dark')} />
        )}
      </div>
    </header>
  );
};

export default Nav;
