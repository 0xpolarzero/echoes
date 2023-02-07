import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import Nav from '@/components/dom/Nav';
import stores from '@/stores';

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef();
  const { Config } = stores.useConfig();
  const { getEchoes } = stores.useGraph();

  useImperativeHandle(ref, () => localRef.current);

  useEffect(() => {
    getEchoes();
  }, [getEchoes]);

  return (
    <Config>
      <div {...props} ref={localRef} className='container'>
        <Nav />
        {children}
      </div>
    </Config>
  );
});
Layout.displayName = 'Layout';

export default Layout;
