import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import Nav from '@/components/dom/Nav';
import stores from '@/stores';

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef();
  const { theme } = stores.useTheme();

  useImperativeHandle(ref, () => localRef.current);

  return (
    <div {...props} ref={localRef} className='container'>
      <ConfigProvider
        theme={{
          algorithm:
            theme === 'dark'
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}>
        <Nav />
        {children}
      </ConfigProvider>
    </div>
  );
});
Layout.displayName = 'Layout';

export default Layout;
