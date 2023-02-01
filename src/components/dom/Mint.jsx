import stores from '@/stores';

const Mint = ({ count }) => {
  console.log(count);
  const { traits } = stores.useTraits();

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_generate</h1>
      <div className='informations'>
        <p>
          You can generate the orb either on a testnet (Polygon Mumbai) or on
          mainnet (Ethereum).
        </p>
        <p>The price is free, etc no benefits</p>
        <p>Proceed with no garantee or whatever, experimental process, etc</p>
      </div>
      <div className='price'>Price buttons</div>
      <div className='mint'>Mint buttons</div>
    </div>
  );
};

export default Mint;
