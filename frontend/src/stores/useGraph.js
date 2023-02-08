import { create } from 'zustand';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getProvider, readContract } from '@wagmi/core';
import config from '@/data';
import useTraits from './useTraits';

/**
 * @notice Set up Apollo
 */

let urls = [
  process.env.NEXT_PUBLIC_SUBGRAPH_ETHEREUM_GOERLI,
  process.env.NEXT_PUBLIC_SUBGRAPH_POLYGON_MUMBAI,
  process.env.NEXT_PUBLIC_SUBGRAPH_ARBITRUM_GOERLI,
];
let clients = urls.map(
  (url) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      uri: url,
    }),
);

export default create((set, get) => ({
  /**
   * @notice Echoes
   */
  echoes: [],
  filteredEchoes: [],

  // Is it ready to display?
  isDisplayReady: false,
  setIsDisplayReady: (isDisplayReady) => set({ isDisplayReady }),

  // Get echoes
  getEchoes: async () => {
    const { fetchSubgraphs, getEchoAttributes, setAvailableSignatures } = get();
    const { getTraitsFromMetadata } = useTraits.getState();
    // Use function from useTraits

    // Get all echoes from all subgraphs
    const data = await fetchSubgraphs();

    // Add their chain to each echo
    const allEchoes = data.map((subgraphData, index) => {
      const chain = config.chains[index];

      return subgraphData.map((echo) => ({
        ...echo,
        chainId: chain.id,
        chainName: chain.name,
        particlesCount: config.calculateParticlesCount(
          echo.createdAt,
          echo.expandedCount,
        ),
      }));
    });

    const sortedEchoes = allEchoes
      .flat()
      .sort((a, b) => a.createdAt - b.createdAt);

    // We want a top 10 for all chain + for each chain
    // e.g. for 3 chains, we need max 30 echoes
    await Promise.all(
      sortedEchoes.map(async (echo, index) => {
        if (index > config.deployedChainIds.length * 10) return;

        const data = await getEchoAttributes(echo);
        const appropriateData = getTraitsFromMetadata(data.attributes);
        echo.attributes = appropriateData;

        return echo;
      }),
    );

    set({ echoes: sortedEchoes, filteredEchoes: sortedEchoes });

    // Update the available signatures per chain based on the data
    setAvailableSignatures(data);
  },

  // Fetch from subgraphs
  fetchSubgraphs: async () => {
    const { data: ethereumGoerliEchoes } = await clients[0].query({
      query: config.subgraphQueries.GET_ECHOS_ETHEREUM_GOERLI,
    });
    const { data: polygonMumbaiEchoes } = await clients[1].query({
      query: config.subgraphQueries.GET_ECHOS_POLYGON_MUMBAI,
    });
    const { data: arbitrumGoerliEchoes } = await clients[2].query({
      query: config.subgraphQueries.GET_ECHOS_ARBITRUM_GOERLI,
    });

    return [
      ethereumGoerliEchoes.echos,
      polygonMumbaiEchoes.echos,
      arbitrumGoerliEchoes.echos,
    ];
  },

  // Filter echoes by chain
  filterEchoes: (chainId) => {
    const { echoes } = get();
    if (chainId === 0 || !chainId) return set({ filteredEchoes: echoes });

    const filteredEchoes = echoes.filter((echo) => echo.chainId === chainId);
    console.log('filteredEchoes', filteredEchoes);
    set({ filteredEchoes });
  },

  // Read echoes on chain on multiple chains
  getEchoAttributes: async (echo) => {
    const chainId = echo.chainId;
    const echoData = await readContract({
      address: config.networkMapping[chainId]['Echoes'][0],
      abi: chainId !== 1 ? config.abiTestnet : config.abiMainnet,
      functionName: 'getEcho',
      args: [echo.tokenId],
      chainId,
    });

    return echoData;
  },

  /**
   * @notice Signatures
   */
  availableSignatures: config.chains.reduce(
    (acc, chain) => ({ ...acc, [chain.id]: config.names }),
    {},
  ),
  setAvailableSignatures: async (echoes) => {
    const signaturesByChain = echoes.reduce((acc, chain, index) => {
      const chainId = config.chains[index].id;
      const signatures = chain.map((echo) => echo.signature);
      acc[chainId] = signatures;
      return acc;
    }, {});

    // Now set available signatures per chain
    const availableSignatures = Object.keys(signaturesByChain).reduce(
      (acc, chainId) => {
        const signatures = signaturesByChain[chainId];
        const availableSignatures = config.names.filter(
          (name) => !signatures.includes(name),
        );
        acc[chainId] = availableSignatures;
        return acc;
      },
      {},
    );

    set({ availableSignatures });
  },
}));
