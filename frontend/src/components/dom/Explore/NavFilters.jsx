import config from '@/data';
import stores from '@/stores';
import { useState } from 'react';

const NavFilters = () => {
  const filterEchoes = stores.useGraph((state) => state.filterEchoes);
  const [selected, setSelected] = useState(0);

  return (
    <div className='nav-filters'>
      <button
        onClick={() => {
          filterEchoes(0);
          setSelected(0);
        }}
        className={selected === 0 ? 'selected' : ''}>
        All echoes
      </button>

      {config.chains.map((chain) => (
        <button
          key={chain.id}
          onClick={() => {
            filterEchoes(chain.id);
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
