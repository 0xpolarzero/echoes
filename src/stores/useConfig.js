import { create } from 'zustand';
import { ConfigProvider, theme as antdTheme } from 'antd';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import useTheme from './useTheme';

const { chains, provider } = configureChains(
  [mainnet, polygonMumbai],
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

export default create((set) => ({
  Config: ({ children }) => {
    const { theme } = useTheme.getState();

    return (
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
    );
  },

  generate: false,
  setGenerate: (generate) => set({ generate }),
}));
