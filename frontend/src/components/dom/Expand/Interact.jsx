import { useEffect, useRef, useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { toast } from 'react-toastify';
import config from '@/data';
import stores from '@/stores';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const Interact = () => {
  const clickedEcho = stores.useGraph((state) => state.clickedEcho);
  const chainId = stores.useConfig((state) => state.chainId);

  // Transaction
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const notification = useRef(null);
  // Remember the echo to update it after the transaction, in case the user 'un-clicks' it

  /**
   * @notice Expand transaction
   */
  const onSettled = async (tx) => {
    if (!tx) return;
    notification.current = toast.loading(
      `Expanding ${clickedEcho.signature}...`,
    );
    const receipt = await tx.wait(1);

    if (receipt.status === 1) {
      setIsSuccess(true);
      toast.update(notification.current, {
        render: `${clickedEcho.signature} has been expanded! Please refresh the page to see the changes.`,
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
  const { config: expandConfig } = usePrepareContractWrite({
    address: config.deployedChainIds.includes(chainId)
      ? config.networkMapping[chainId]['Echoes'][0] || ''
      : '',
    abi: chainId !== 1 ? config.abiTestnet : config.abiMainnet || '',
    functionName: 'expand',
    args: [Number(clickedEcho?.tokenId)],
    enabled:
      clickedEcho &&
      clickedEcho?.particlesCount < 10_000 &&
      // Not in cooldown
      Date.now() - Number(clickedEcho?.lastExpandedAt) * 1000 > 10 * 60 * 1000,
  });

  const { isLoading, write: expand } = useContractWrite({
    ...expandConfig,
    onSettled,
  });

  useEffect(() => {
    // Reset state
    setIsSuccess(false);
    setIsError(false);
  }, [clickedEcho]);

  if (!clickedEcho) return null;

  return (
    <div className='actions'>
      <button
        onClick={!isLoading ? expand : null}
        disabled={
          !config.deployedChainIds.includes(chainId) ||
          clickedEcho?.particlesCount >= 10_000 ||
          Date.now() - Number(clickedEcho.lastExpandedAt) * 1000 <
            10 * 60 * 1000
        }
        className={
          isLoading
            ? 'button-primary loading'
            : isSuccess || isError
            ? 'button-primary has-icon'
            : 'button-primary'
        }>
        {config.deployedChainIds.includes(chainId) &&
        isSuccess &&
        !isLoading ? (
          <AiOutlineCheck color='var(--text-success)' />
        ) : chainId === 80001 && isError && !isLoading ? (
          <AiOutlineClose color='var(--text-error)' />
        ) : null}
        <span>Expand</span>
      </button>
      {clickedEcho.particlesCount >= 10_000 ? (
        <span className='emphasize'>_max expansion reached</span>
      ) : (
        <Countdown timestamp={Number(clickedEcho.lastExpandedAt) * 1000} />
      )}
    </div>
  );
};

const Countdown = ({ timestamp }) => {
  const max = 10 * 60 * 1000;
  const [countdown, setCountdown] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    const count = () => {
      const now = Date.now();
      const diff = now - timestamp;
      if (diff >= max) {
        setCountdown(0);
        setIsCooldown(false);
      } else {
        setCountdown(Math.round((max - diff) / 1000));
        setIsCooldown(true);
      }
    };

    const interval = setInterval(count, 1000);
    count();

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div>
      <span className='caption'>expansion cooldown_</span>{' '}
      {isCooldown ? (
        <span className='emphasize'>
          {Math.floor(countdown / 60)
            .toString()
            .padStart(2, '0')}
          :
          {Math.floor(countdown % 60)
            .toString()
            .padStart(2, '0')}
        </span>
      ) : (
        <span className='emphasize'>waiting for expansion</span>
      )}
    </div>
  );
};

export default Interact;
