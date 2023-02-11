import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import stores from '@/stores';
import WalletInfo from './WalletInfo';
import config from '@/data';
import Infos from '../Infos';
import Controls from './Controls';

const Expand = () => {
  const { echoes, ownedEchoes, setOwnedEchoes, filterEchoesByChain } =
    stores.useGraph((state) => ({
      echoes: state.echoes,
      ownedEchoes: state.ownedEchoes,
      setOwnedEchoes: state.setOwnedEchoes,
      filterEchoesByChain: state.filterEchoesByChain,
    }));
  const chainId = stores.useConfig((state) => state.chainId);
  const resetTarget = stores.useGraph((state) => state.resetTarget);
  const { address } = useAccount();

  const [page, setPage] = useState(0);

  // Filter echoes for the owner
  useEffect(() => {
    setOwnedEchoes(address);
  }, [address, echoes, setOwnedEchoes]);

  // Filter echoes for the chain
  useEffect(() => {
    if (config.deployedChainIds.includes(chainId)) {
      filterEchoesByChain(chainId, true, page); // true = use owned echoes
    }
    resetTarget();
  }, [chainId, ownedEchoes, page, filterEchoesByChain, resetTarget]);

  return (
    <>
      <WalletInfo />
      <Infos actions={true} />
      {ownedEchoes.length > 10 && (
        <Controls page={page} setPage={setPage} amount={ownedEchoes.length} />
      )}
    </>
  );
};

export default Expand;
