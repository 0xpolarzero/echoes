import { useEffect, useRef, useState } from 'react';
import { Input, Tooltip } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import stores from '@/stores';
import { useAccount, useBalance, useNetwork } from 'wagmi';

// let isConnected = false;
let chain = 'maticmum';

const Mint = ({ count }) => {
  const { traits, getTraitsFromMetadata, getMetadataFromTraits } =
    stores.useTraits();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({ address });
  const ref = useRef();

  // Price
  const [price, setPrice] = useState(0.001);
  const [input, setInput] = useState(0.001);

  const handleInput = (e) => {
    const value = e.target.value;
    if (value < 0.001) {
      setInput(0.001);
      setPrice(0.001);
    } else {
      setInput(value);
      setPrice(value);
    }
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    setPrice(value);

    const buttons = ref.current.querySelectorAll('button');
    buttons.forEach((button) => button.classList.remove('selected'));
    ref.current.querySelector('input').classList.remove('selected');

    e.target.classList.add('selected');
  };

  useEffect(() => {
    const metadata = getMetadataFromTraits(traits);
    console.log(metadata);
    console.log(getTraitsFromMetadata(metadata));
  }, [traits]);

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_generate</h1>
      <div className='informations'>
        <p>
          You can generate an orb either on a testnet (Polygon Mumbai) or on
          mainnet (Ethereum).
        </p>
        <p>
          The orbs can be generated{' '}
          <span className='emphasize'>for free on testnet</span>, or{' '}
          <span className='emphasize'>for a fixed price on mainnet</span>. Both
          chains provide the{' '}
          <span className='emphasize'>exact same functionalities</span>, so you
          are welcome to mint on a testnet if you just want to experiment.
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Please be aware that minting an orb is an experimental process and
          there is no guarantee regarding its reliability or value. By
          participating in the mint, you understand that you are doing so at
          your own risk and that the digital product is provided "as is" without
          any warranties or guarantees of any kind.
        </p>
      </div>
      <div className='wallet'>
        <ConnectButton label='Connect your wallet to generate the orb' />
      </div>
      <div ref={ref} className='price'>
        <PriceButton
          value={0.001}
          balance={balance?.formatted || 0}
          onClick={handleSelect}
          selected={true}
        />
        <PriceButton
          value={0.01}
          balance={balance?.formatted || 0}
          onClick={handleSelect}
          selected={false}
        />
        <PriceButton
          value={0.1}
          balance={balance?.formatted || 0}
          onClick={handleSelect}
          selected={false}
        />

        <Tooltip
          title={input > balance?.formatted ? 'Insufficient balance.' : ''}>
          <Input
            type='number'
            onClick={handleSelect}
            placeholder='Custom price (min. 0.001 ETH)'
            value={input}
            onChange={handleInput}
            className={input > balance?.formatted ? 'error' : ''}
            style={{ maxWidth: '200px' }}
            suffix='ETH'
          />
        </Tooltip>
      </div>
      <div className='mint'>
        <Tooltip
          title={
            chain?.id !== 80001
              ? 'You need to switch chains to Polygon Mumbai.'
              : ''
          }>
          <button disabled={chain?.id !== 80001 || !isConnected}>
            Generate on testnet (free)
          </button>
        </Tooltip>
        <Tooltip
          title={
            chain?.id !== 1
              ? 'You need to switch chains to Ethereum mainnet.'
              : ''
          }>
          <button disabled={chain?.id !== 1 || !isConnected}>
            Generate on mainnet ({price} ETH)
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

const PriceButton = ({ value, balance, onClick, selected }) => {
  const notEnoughBalance = value > balance;

  return (
    <Tooltip title={notEnoughBalance ? 'Insufficient balance.' : ''}>
      <button
        onClick={onClick}
        value={value}
        disabled={notEnoughBalance}
        className={selected ? 'selected' : ''}>
        {value} ETH
      </button>
    </Tooltip>
  );
};

export default Mint;
