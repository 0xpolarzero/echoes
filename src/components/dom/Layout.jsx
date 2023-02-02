import { useRef, forwardRef, useImperativeHandle } from 'react';
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
import Nav from '@/components/dom/Nav';
import stores from '@/stores';

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef();
  const { theme } = stores.useTheme();

  useImperativeHandle(ref, () => localRef.current);

  // Configure wallet
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
    autoConnect: false,
    connectors,
    provider,
  });

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
          <div {...props} ref={localRef} className='container'>
            <Nav />
            {children}
          </div>
        </ConfigProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
});
Layout.displayName = 'Layout';

export default Layout;
