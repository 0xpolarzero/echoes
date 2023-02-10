import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import stores from '@/stores';
import WalletInfo from './WalletInfo';
import config from '@/data';
import Infos from '../Infos';

const Expand = () => {
  // filtered show 10 first
  // ownersEchoes
  // navigate increments/decrements index set here
  // set filtered based on index in ownersEchoes
  const {
    echoes,
    ownedEchoes,
    filteredEchoes,
    setOwnedEchoes,
    filterEchoesByChain,
  } = stores.useGraph((state) => ({
    echoes: state.echoes,
    ownedEchoes: state.ownedEchoes,
    filteredEchoes: state.filteredEchoes,
    setOwnedEchoes: state.setOwnedEchoes,
    filterEchoesByChain: state.filterEchoesByChain,
  }));
  const chainId = stores.useConfig((state) => state.chainId);
  const { address } = useAccount();

  const [page, setPage] = useState(0);

  // Filter echoes for the owner
  useEffect(() => {
    setOwnedEchoes(address);
  }, [address, echoes, setOwnedEchoes]);

  // Filter echoes for the chain
  useEffect(() => {
    if (config.deployedChainIds.includes(chainId)) {
      filterEchoesByChain(chainId, true, 0); // true = use owned echoes, 0 = page
      setPage(0);
    }
  }, [chainId, ownedEchoes, filterEchoesByChain]);

  return (
    <>
      <WalletInfo />
      <Infos actions={true} />
    </>
  );
};

export default Expand;
