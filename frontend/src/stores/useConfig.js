import { create } from 'zustand';
// UI
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ToastContainer } from 'react-toastify';
// ConnectKit
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
// Wagmi
import { createClient, WagmiConfig } from 'wagmi';
import { mainnet, goerli, polygonMumbai, arbitrumGoerli } from 'wagmi/chains';

import config from '@/data';

/**
 * @notice Set up providers
 */

const wagmiClient = createClient(
  getDefaultClient({
    appName: 'echoes',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains: [goerli, polygonMumbai, arbitrumGoerli],
    autoConnect: true,
  }),
);

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
          <ConnectKitProvider
            client={wagmiClient}
            theme='default'
            mode={theme}
            options={{
              embedGoogleFonts: true,
              showBalance: true,
              initialChainId: 0,
            }}
            customTheme={{
              '--ck-font-family': 'var(--font-main)',
              '--ck-accent-color': 'var(--text-link)',
              '--ck-accent-text-color': 'var(--text-main)',
              // Connect button
              '--ck-connectbutton-border-radius': '8px',
              '--ck-connectbutton-background': 'var(--background-button)',
            }}>
            <ConfigProvider
              theme={{
                algorithm:
                  theme === 'dark'
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
              }}>
              {children}
            </ConfigProvider>
          </ConnectKitProvider>
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
   * @notice Page
   */
  generate: false,
  setGenerate: (generate) => set({ generate }),

  activePage: '',
  setActivePage: (activePage) => set({ activePage }),
}));
