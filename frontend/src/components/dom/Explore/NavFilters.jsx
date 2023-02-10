import config from '@/data';
import stores from '@/stores';
import { useEffect, useState } from 'react';

const NavFilters = () => {
  const filterEchoesByChain = stores.useGraph(
    (state) => state.filterEchoesByChain,
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    filterEchoesByChain(0);
  }, [filterEchoesByChain]);

  return (
    <div className='nav-filters'>
      <button
        onClick={() => {
          filterEchoesByChain(0);
          setSelected(0);
        }}
        className={selected === 0 ? 'selected' : ''}>
        All echoes
      </button>

      {config.chains.map((chain) => (
        <button
          key={chain.id}
          onClick={() => {
            filterEchoesByChain(chain.id);
            setSelected(chain.id);
          }}
          className={selected === chain.id ? 'selected' : ''}>
          {chain.name}
        </button>
      ))}
    </div>
  );
};

export default NavFilters;
