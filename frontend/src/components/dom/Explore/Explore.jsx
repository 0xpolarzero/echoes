import stores from '@/stores';
import NavFilters from './NavFilters';

const Explore = () => {
  const { isDisplayReady } = stores.useGraph();
  return <NavFilters />;
};

export default Explore;
