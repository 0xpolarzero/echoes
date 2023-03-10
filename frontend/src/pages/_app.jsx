import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/config';
import Layout from '@/components/dom/Layout';
import '@/styles/index.css';
import { isMobile } from 'react-device-detect';

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true });

export default function App({ Component, pageProps = { title: 'echoes' } }) {
  const layout = useRef();
  const loader = useRef();
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && loader.current)
      loader.current.classList.add('hidden');
  }, []);

  useEffect(() => {
    if (isMobile) setIsAvailable(false);
  }, []);

  return (
    <>
      <Header title={pageProps.title} />

      <Layout ref={layout}>
        {isAvailable ? (
          <>
            <Component {...pageProps} />
            {Component?.canvas && (
              <Scene
                className='canvas'
                eventSource={layout}
                eventPrefix='client'>
                {Component.canvas(pageProps)}
              </Scene>
            )}
          </>
        ) : (
          <div className='error-overlay'>
            <p>
              Unfortunately, this app is not yet available on mobile devices.
            </p>
            <p>Please visit on a desktop or laptop.</p>
          </div>
        )}
      </Layout>
      <div ref={loader} id='loader'>
        <div className='loader' />
      </div>
    </>
  );
}
