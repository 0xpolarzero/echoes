import { useRef, useState } from 'react';

const lightProperties = [
  { '--text-main': 'rgba(0, 0, 0, 0.8)' },
  { '--text-main-full': 'rgba(0, 0, 0, 1)' },
  { '--background-main': '#e9e9e9' },
  { '--background-main-rgb': '233, 233, 233' },
  { '--text-link-hover': '#747bff' },
  { '--background-button': '#f9f9f9' },
  { '--button-border': 'rgba(0, 0, 0, 0.1)' },
];

const darkProperties = [
  { '--text-main': 'rgba(255, 255, 255, 0.87)' },
  { '--text-main-full': 'rgba(255, 255, 255, 1)' },
  { '--background-main': '#101010' },
  { '--background-main-rgb': '16, 16, 16' },
  { '--text-link-hover': '#535bf2' },
  { '--background-button': '#1a1a1a' },
  { '--button-border': 'rgba(255, 255, 255, 0.1)' },
];

const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  const setLocalRef = useRef(null);

  const updateTheme = (newTheme, setLocal) => {
    const themeString =
      typeof newTheme === 'string'
        ? newTheme
        : newTheme.light
        ? 'light'
        : 'dark';
    let newBg = typeof newTheme === 'string' ? null : newTheme.hex;

    setTheme(themeString);
    themeString === 'light' ? setLight() : setDark();
    if (newBg)
      document.documentElement.style.setProperty('--background-main', newBg);

    // document.documentElement.setAttribute('data-theme', newTheme);

    if (setLocal) setLocalRef.current = setLocal;
    if (setLocalRef.current) setLocal(newTheme);
  };

  const setLight = () => {
    lightProperties.forEach((property) => {
      const key = Object.keys(property)[0];
      const value = Object.values(property)[0];

      document.documentElement.style.setProperty(key, value);
    });
  };

  const setDark = () => {
    darkProperties.forEach((property) => {
      const key = Object.keys(property)[0];
      const value = Object.values(property)[0];

      document.documentElement.style.setProperty(key, value);
    });
  };

  return { theme, updateTheme };
};

export default useTheme;
