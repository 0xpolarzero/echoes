import stores from '@/stores';

const Mint = ({ count }) => {
  console.log(count);
  const { traits } = stores.useTraits();

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_generate</h1>
      <div className='informations'>
        <p>
          You can generate an orb either on a testnet (Polygon Mumbai) or on
          mainnet (Ethereum).
        </p>
        <p>
          The orbs are{' '}
          <span className='emphasize'>free to generate (only gas)</span>. You
          are welcome to add any value, if you would like to show support.
          However, it's important to note that adding value to your NFT{' '}
          <span className='emphasize'>
            won't give you any benefits or exclusive privileges
          </span>
          . It's simply a way to show your appreciation for the project.
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Please be aware that minting an orb is an experimental process and
          there is no guarantee regarding its reliability or value. By
          participating in the mint, you understand that you are doing so at
          your own risk and that the digital product is provided "as is" without
          any warranties or guarantees of any kind.
        </p>
      </div>
      <div className='price'>Price buttons</div>
      <div className='mint'>Mint buttons</div>
    </div>
  );
};

export default Mint;
