import { useEffect, useState } from 'react';
import { BsArrow90DegLeft } from 'react-icons/bs';
import config from '@/data';
import stores from '@/stores';

const NavFilters = () => {
  const { echoes, filterEchoesByChain, clickedEcho, resetTarget } =
    stores.useGraph((state) => ({
      filterEchoesByChain: state.filterEchoesByChain,
      echoes: state.echoes,
      clickedEcho: state.clickedEcho,
      resetTarget: state.resetTarget,
    }));
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    filterEchoesByChain(0);
    resetTarget();
  }, [echoes, filterEchoesByChain]);

  return (
    <div className='nav-filters'>
      <button
        onClick={resetTarget}
        className={clickedEcho ? 'primary close' : 'primary close hidden'}>
        <BsArrow90DegLeft />
      </button>
      <div className='filters'>
        <button
          onClick={() => {
            filterEchoesByChain(0);
            setSelected(0);
          }}
          className={selected === 0 ? 'primary selected' : 'primary'}>
          All echoes
        </button>

        {config.chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => {
              filterEchoesByChain(chain.id);
              setSelected(chain.id);
            }}
            className={selected === chain.id ? 'primary selected' : 'primary'}>
            {chain.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavFilters;
