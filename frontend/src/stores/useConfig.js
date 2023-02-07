import { create } from 'zustand';
// UI
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ToastContainer } from 'react-toastify';
// RainbowKit
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
// Wagmi
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, goerli, polygonMumbai, arbitrumGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import config from '@/data';

/**
 * @notice Set up providers
 */
const { chains, provider } = configureChains(
  [mainnet, goerli, polygonMumbai, arbitrumGoerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'celestial_orbs',
  chains,
});

const wagmiClient = createClient({
  connectors,
  provider,
});

/**
 * @notice Themes
 */
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

export default create((set, get) => ({
  /**
   * @notice Providers configuration
   */
  Config: ({ children }) => {
    const { theme } = get();

    return (
      <>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={
              theme === 'dark'
                ? darkTheme({ accentColor: 'var(--text-link)' })
                : lightTheme({ accentColor: 'var(--text-link)' })
            }>
            <ConfigProvider
              theme={{
                algorithm:
                  theme === 'dark'
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
              }}>
              {children}
            </ConfigProvider>
          </RainbowKitProvider>
        </WagmiConfig>
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          newestOnTop
          theme={theme}
        />
      </>
    );
  },

  /**
   * @notice Theme configuration
   */
  theme: 'dark',
  updateTheme: (newTheme) => {
    const { setLight, setDark } = get();

    const themeString =
      typeof newTheme === 'string'
        ? newTheme
        : newTheme.light
        ? 'light'
        : 'dark';
    let newBg = typeof newTheme === 'string' ? null : newTheme.hex;

    set({ theme: themeString });
    themeString === 'light' ? setLight() : setDark();
    if (newBg)
      document.documentElement.style.setProperty('--background-main', newBg);
  },

  setLight: () => {
    lightProperties.forEach((property) => {
      const key = Object.keys(property)[0];
      const value = Object.values(property)[0];

      document.documentElement.style.setProperty(key, value);
    });
  },

  setDark: () => {
    darkProperties.forEach((property) => {
      const key = Object.keys(property)[0];
      const value = Object.values(property)[0];

      document.documentElement.style.setProperty(key, value);
    });
  },

  /**
   * @notice Network configuration
   */
  chainId: null,
  setChainId: (chainId) => {
    if (!config.deployedChainIds.includes(chainId)) {
      console.log(`Chain ID ${chainId} is not supported`);
      set({ chainId: null });
    } else {
      set({ chainId });
    }
  },

  /**
   * @notice Other configuration (which page is it on)
   */
  generate: false,
  setGenerate: (generate) => set({ generate }),
}));
