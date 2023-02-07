import { ethers } from 'ethers';
import traits from '@/data/traits.js';
import names from '@/data/names.json';
import networkMapping from '@/data/constants/networkMapping.json';
import abiMainnet from '@/data/constants/EchoesMainnet.json';
import abiTestnet from '@/data/constants/EchoesTestnet.json';
import queries from './constants/subgraphQueries';

const description =
  'An enigma of light, figure, and atmosphere, a singular spectrum frozen in time.';
const externalUrl = '';
const background = '101010';

const MINT_PRICE_ETH = 0.01;
const MINT_PRICE_WEI = ethers.utils.parseEther(MINT_PRICE_ETH.toString());

const defaultChainId = 5;
const deployedChainIds = [1, 5, 80001, 421613];

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
  MINT_PRICE_ETH,
  MINT_PRICE_WEI,
  defaultChainId,
  deployedChainIds,
};

export default config;
