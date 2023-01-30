import { startTransition, useEffect, useState } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  const updateTheme = () => {
    // if (typeof window !== 'undefined') {
    //   const userTheme = window.matchMedia('(prefers-color-scheme: dark)')
    //     .matches
    //     ? 'dark'
    //     : 'light';
    //   startTransition(() => {
    //     setTheme(userTheme);
    //   });
    // }
  };

  // useEffect(() => {
  //   updateTheme();
  //   window.addEventListener('color-scheme-changed', updateTheme);
  //   return () => {
  //     window.removeEventListener('color-scheme-changed', updateTheme);
  //   };
  // }, []);

  return { theme, setTheme };
};

export default useTheme;
