import { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import stores from '@/stores';

let isConnected = false;
let chain = 'maticmum';

const Mint = ({ count }) => {
  const { traits } = stores.useTraits();
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

  const connectWallet = () => {};

  useEffect(() => {
    console.log('rerendered');
  }, []);

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
        <button onClick={handleSelect} value={0.001} className='selected'>
          0.001 ETH
        </button>
        <button onClick={handleSelect} value={0.01}>
          0.01 ETH
        </button>
        <button onClick={handleSelect} value={0.1}>
          0.1 ETH
        </button>
        {/* <button
          onClick={handleSelectInput}
          value={input}
          onChange={handleInput}>
          Custom (min. 0.001 ETH)
        </button> */}
        <input
          type='number'
          onClick={handleSelect}
          value={input}
          onChange={handleInput}
        />
        {/* Custom (min. 0.001 ETH) */}
        {/* </input> */}
      </div>
      <div className='mint'>
        <Tooltip
          title={
            chain !== 'maticmum'
              ? 'You need to switch chains to Polygon Mumbai.'
              : ''
          }>
          <button disabled={chain !== 'maticmum' || !isConnected}>
            Generate on testnet (free)
          </button>
        </Tooltip>
        <Tooltip
          title={
            chain !== 'mainnet'
              ? 'You need to switch chains to Ethereum mainnet.'
              : ''
          }>
          <button disabled={chain !== 'mainnet' || !isConnected}>
            Generate on mainnet ({price} ETH)
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Mint;
