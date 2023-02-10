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
  hoveredEcho: null,
  setHoveredEcho: (hoveredEcho) => set({ hoveredEcho }),
  clickedEcho: null,
  setClickedEcho: (clickedEcho) => set({ clickedEcho }),
  // Expand
  ownedEchoes: [],
  setOwnedEchoes: (address) => {
    const { echoes } = get();

    const ownedEchoes = address
      ? echoes.filter(
          (echo) => echo.owner.toLowerCase() === address.toLowerCase(),
        )
      : [];

    set({ ownedEchoes, filteredEchoes: [] });
  },

  // Get echoes
  getEchoes: async () => {
    const { fetchSubgraphs, setAvailableSignatures } = get();

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

    set({ echoes: sortedEchoes });

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
  filterEchoesByChain: async (chainId, owned = false, page = 0) => {
    const { echoes, ownedEchoes, getEchoesAttributes } = get();
    // Set loading while fetching data
    set({ filteredEchoes: [] });

    // Are we filtering in explore (all echoes) or expand (owned echoes)?
    const toFilter = owned ? ownedEchoes : echoes;

    const filtered =
      chainId === 0 || !chainId
        ? // Just return the top 10 if no chain is selected
          toFilter.slice(0, 10)
        : // Otherwise filter by chain
          toFilter
            .filter((echo) => echo.chainId === chainId)
            .slice(page, page + 10);

    // Fetch data for the filtered echoes
    const filteredWithAttributes = await getEchoesAttributes(filtered);

    set({ filteredEchoes: filteredWithAttributes });
  },

  // Read echoes on multiple chains
  getEchoesAttributes: async (echoes) => {
    const { getTraitsFromMetadata } = useTraits.getState();

    const getAttributes = async (echo) => {
      const chainId = echo.chainId;

      const echoData = await readContract({
        address: config.networkMapping[chainId]['Echoes'][0],
        abi: chainId !== 1 ? config.abiTestnet : config.abiMainnet,
        functionName: 'getEcho',
        args: [echo.tokenId],
        chainId,
      });

      return echoData;
    };

    return await Promise.all(
      echoes.map(async (echo, index) => {
        // Don't fetch it again if it's already there
        if (!echo.attributes) {
          const data = await getAttributes(echo);
          const appropriateData = getTraitsFromMetadata(data.attributes);
          echo.attributes = appropriateData;
        }

        return echo;
      }),
    );
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
