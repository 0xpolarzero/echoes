import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { BsArrow90DegLeft } from 'react-icons/bs';
import config from '@/data';
import stores from '@/stores';

const WalletInfo = () => {
  const { chainId, setChainId } = stores.useConfig((state) => ({
    chainId: state.chainId,
    setChainId: state.setChainId,
  }));
  const { clickedEcho, resetTarget } = stores.useGraph((state) => ({
    clickedEcho: state.clickedEcho,
    resetTarget: state.resetTarget,
  }));

  const { chain } = useNetwork();

  // Chain
  useEffect(() => {
    // We need to use this trick because wagmi hook useNetwork sets the chain too late
    if (chain?.id) setChainId(chain.id);
  }, [chain, setChainId]);

  return (
    <div className='nav-filters'>
      <button
        onClick={resetTarget}
        className={clickedEcho ? 'primary close' : 'primary close hidden'}>
        <BsArrow90DegLeft />
      </button>
      <div className='filters'>
        {chain && chainId ? (
          <>
            <span className='emphasize'>
              Your echoes on {config.chains.find((c) => c.id === chainId).name}
            </span>
            <ConnectKitButton />
          </>
        ) : (
          <>
            <span className='emphasize'>
              connect your wallet to a supported chain to see your echoes_
            </span>
            <ConnectKitButton />
          </>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;
