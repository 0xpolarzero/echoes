import { ethers } from 'ethers';
// Data
import traits from '@/data/traits.js';
import names from '@/data/names.json';
// Constants
import networkMapping from '@/data/constants/networkMapping.json';
import abiMainnet from '@/data/constants/EchoesMainnet.json';
import abiTestnet from '@/data/constants/EchoesTestnet.json';
import queries from './constants/subgraphQueries';
// Systems
import calculateParticlesCount from './systems/calculateParticlesCount';

// Metadata
const description =
  'An enigma of light, figure, and atmosphere, a singular spectrum frozen in time.';
const externalUrl = '';
const background = '101010';

// Constants
const MINT_PRICE_ETH = 0.01;
const MINT_PRICE_WEI = ethers.utils.parseEther(MINT_PRICE_ETH.toString());

// Networks
const chains = [
  { id: 5, name: 'Ethereum Goerli' },
  { id: 80001, name: 'Polygon Mumbai' },
  { id: 421613, name: 'Arbitrum Goerli' },
];
const defaultChainId = 5;
const deployedChainIds = [5, 80001, 421613];

const config = {
  traits,
  names,
  description,
  externalUrl,
  background,
  networkMapping,
  abiMainnet,
  abiTestnet,
  subgraphQueries: queries,
  calculateParticlesCount,
  MINT_PRICE_ETH,
  MINT_PRICE_WEI,
  chains,
  defaultChainId,
  deployedChainIds,
};

export default config;
