import { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { toast } from 'react-toastify';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import config from '@/data';
import stores from '@/stores';

const { MINT_PRICE_ETH, MINT_PRICE_WEI } = config;

const Mint = ({ count }) => {
  const { traits, getMetadataFromTraits } = stores.useTraits();
  const { chainId, setChainId, filterAvailableSignatures } = stores.useMint();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({ address });

  const [isBalanceEnough, setIsBalanceEnough] = useState(false);
  const [missingSignature, setMissingSignature] = useState(true);
  // Mint
  const [mintArgs, setMintArgs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const notification = useRef(null);

  /**
   * @notice Mint transaction
   */
  const onSettled = async (tx) => {
    if (!tx) return;
    notification.current = toast.loading('Generating your echo...');
    const receipt = await tx.wait(1);

    if (receipt.status === 1) {
      setIsSuccess(true);
      toast.update(notification.current, {
        render: 'Your echo has been generated!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
    } else {
      setIsError(true);
      toast.update(notification.current, {
        render: 'Something went wrong, please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };
  const { config: mintConfig } = usePrepareContractWrite({
    address: config.deployedChainIds.includes(chainId)
      ? config.networkMapping[chainId]['Echoes'][0] || ''
      : '',
    abi: chainId !== 1 ? config.Testnet : config.abiMainnet || '',
    functionName: 'mint',
    args: [...mintArgs, chainId === 1 ? { value: MINT_PRICE_WEI } : null],
    // Only enable if all args are filled & chain is mumbai or ethereum mainnet
    enabled: mintArgs.length,
  });

  const { isLoading, write: mint } = useContractWrite({
    ...mintConfig,
    onSettled,
  });

  // Metadata & mint args
  useEffect(() => {
    const metadata = getMetadataFromTraits(traits);

    // Is the signature missing?
    if (!metadata[0]) {
      setMissingSignature(true);
    } else {
      setMissingSignature(false);
    }

    // Set mint args
    if (!missingSignature && config.deployedChainIds.includes(chainId))
      setMintArgs(metadata);
    // Reset if changing anything
    setIsSuccess(false);
    setIsError(false);
  }, [traits, getMetadataFromTraits, missingSignature, chainId]);

  // Balance
  useEffect(() => {
    if (balance?.formatted < MINT_PRICE_ETH) {
      setIsBalanceEnough(false);
    } else {
      setIsBalanceEnough(true);
    }
  }, [balance]);

  // Chain
  useEffect(() => {
    // We need to use this trick because wagmi hook useNetwork sets the chain too late
    if (chain?.id) {
      setChainId(chain.id);
      // Update the available signatures for this chain
      filterAvailableSignatures(chain.id);
    }
  }, [chain?.id, setChainId, filterAvailableSignatures]);

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_generate</h1>
      <div className='informations'>
        <p>
          You can generate an echo either on a testnet (Polygon Mumbai) or on
          mainnet (Ethereum).
        </p>
        <p>
          The echoes can be generated{' '}
          <span className='emphasize'>for free on testnet</span>, or{' '}
          <span className='emphasize'>for a fixed price on mainnet</span>. Both
          chains provide the{' '}
          <span className='emphasize'>exact same functionalities</span>, so you
          are welcome to mint on a testnet if you just want to experiment.
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Please be aware that minting an echo is an experimental process and
          there is no guarantee regarding its reliability or value. By
          participating in the mint, you understand that you are doing so at
          your own risk and that the digital product is provided &#34;as is&#34;
          without any warranties or guarantees of any kind.
        </p>
      </div>
      <div className='wallet'>
        <ConnectButton label='Connect your wallet to generate the echo' />
      </div>

      <div className='mint'>
        <Tooltip
          title={
            !config.deployedChainIds.includes(chainId) && chainId !== 1
              ? 'You need to switch chains to a testnet (Ethereum Goerli, Polygon Mumbai, Arbitrum Goerli).'
              : missingSignature
              ? 'The signature is missing.'
              : ''
          }>
          <button
            onClick={!isLoading ? mint : null}
            disabled={
              (!config.deployedChainIds.includes(chainId) && chainId !== 1) ||
              !isConnected ||
              missingSignature
            }
            className={
              config.deployedChainIds.includes(chainId) && chainId !== 1
                ? isLoading
                  ? 'loading'
                  : isSuccess || isError
                  ? 'has-icon'
                  : ''
                : ''
            }>
            {config.deployedChainIds.includes(chainId) &&
            chainId !== 1 &&
            isSuccess &&
            !isLoading ? (
              <AiOutlineCheck color='var(--text-success)' />
            ) : chainId === 80001 && isError && !isLoading ? (
              <AiOutlineClose color='var(--text-error)' />
            ) : null}
            <span>Generate on testnet (free)</span>
          </button>
        </Tooltip>
        <Tooltip
          title={
            chainId !== 1
              ? 'You need to switch chains to Ethereum mainnet.'
              : !isBalanceEnough
              ? 'Insufficient balance.'
              : missingSignature
              ? 'The signature is missing.'
              : ''
          }>
          <button
            onClick={!isLoading ? mint : null}
            disabled={
              chainId !== 1 ||
              !isConnected ||
              !isBalanceEnough ||
              missingSignature
            }
            className={
              chainId === 1
                ? isLoading
                  ? 'loading'
                  : isSuccess || isError
                  ? 'has-icon'
                  : ''
                : ''
            }>
            {chainId === 1 && isSuccess && !isLoading ? (
              <AiOutlineCheck color='var(--text-success)' />
            ) : chainId === 1 && isError && !isLoading ? (
              <AiOutlineClose color='var(--text-error)' />
            ) : null}
            <span>Generate on mainnet ({MINT_PRICE_ETH} ETH)</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Mint;
