import stores from '@/stores';
import NavFilters from './NavFilters';
import Infos from './Infos';

const Explore = () => {
  const isDisplayReady = stores.useGraph((state) => state.isDisplayReady);

  return (
    <>
      <NavFilters />
      <Infos />
    </>
  );
};

export default Explore;
