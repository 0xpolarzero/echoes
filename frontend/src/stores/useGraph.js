import { create } from 'zustand';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from '@/data';

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

const chains = [
  { id: 5, name: 'Ethereum Goerli' },
  { id: 80001, name: 'Polygon Mumbai' },
  { id: 421613, name: 'Arbitrum Goerli' },
];

export default create((set, get) => ({
  /**
   * @notice Echoes
   */
  echoes: [],
  echoesByChain: {},
  getEchoes: async () => {
    const { fetchSubgraphs, setAvailableSignatures } = get();
    // Get all echoes from all subgraphs
    const data = await fetchSubgraphs();

    // Add their chain to each echo
    const allEchoes = data.map((subgraphData, index) => {
      const chain = chains[index];

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

  /**
   * @notice Signatures
   */
  availableSignatures: chains.reduce(
    (acc, chain) => ({ ...acc, [chain.id]: config.names }),
    {},
  ),
  setAvailableSignatures: async (echoes) => {
    const signaturesByChain = echoes.reduce((acc, chain, index) => {
      const chainId = chains[index].id;
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
