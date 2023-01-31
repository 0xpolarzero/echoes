import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import hooks from '@/hooks';
import Nav from '@/components/dom/Nav';

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef();
  const { theme } = hooks.useTheme();
  const [localTheme, setLocalTheme] = useState(theme);

  useImperativeHandle(ref, () => localRef.current);

  return (
    <div {...props} ref={localRef} className={`container ${theme}`}>
      <ConfigProvider
        theme={{
          algorithm:
            localTheme === 'dark'
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}>
        <Nav layoutRef={localRef} setLocalTheme={setLocalTheme} />
        {children}
      </ConfigProvider>
    </div>
  );
});
Layout.displayName = 'Layout';

export default Layout;
