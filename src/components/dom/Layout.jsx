import {
  useRef,
  forwardRef,
  useImperativeHandle,
  startTransition,
  useEffect,
  useState,
} from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import hooks from '@/hooks';
import Nav from '@/components/dom/Nav';

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef();
  const { theme } = hooks.useTheme();

  useImperativeHandle(ref, () => localRef.current);

  useEffect(() => {
    console.log('theme changed');
  }, [theme]);

  return (
    <div {...props} ref={localRef} className={`container ${theme}`}>
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
