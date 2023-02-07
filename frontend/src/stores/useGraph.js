import { create } from 'zustand';
// Apollo
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import { onError } from '@apollo/client/link/error';

import config from '@/data';

/**
 * @notice Set up Apollo
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    errorLink,
    new MultiAPILink({
      endpoints: {
        ethereumGoerli: process.env.NEXT_PUBLIC_SUBGRAPH_ETHEREUM_GOERLI,
        polygonMumbai: process.env.NEXT_PUBLIC_SUBGRAPH_POLYGON_MUMBAI,
        arbitrumGoerli: process.env.NEXT_PUBLIC_SUBGRAPH_ARBITRUM_GOERLI,
      },
      createHttpLink: () => createHttpLink(),
      httpSuffix: '',
    }),
  ]),
  cachePolicy: 'network-only',
});

export default create((set, get) => ({
  echoes: [],
  getEchoes: async () => {
    // Get all echoes from all subgraphs
    const { data: ethereumGoerliEchoes } = await apolloClient.query({
      query: config.subgraphQueries.GET_ECHOS_ETHEREUM_GOERLI,
    });
    const { data: polygonMumbaiEchoes } = await apolloClient.query({
      query: config.subgraphQueries.GET_ECHOS_POLYGON_MUMBAI,
    });
    const { data: arbitrumGoerliEchoes } = await apolloClient.query({
      query: config.subgraphQueries.GET_ECHOS_ARBITRUM_GOERLI,
    });
    // Add their chainId to each echo
    const allEchoes = [
      ...ethereumGoerliEchoes.echos.map((echo) => ({
        ...echo,
        chainId: 5,
      })),
      ...polygonMumbaiEchoes.echos.map((echo) => ({
        ...echo,
        chainId: 80001,
      })),
      ...arbitrumGoerliEchoes.echos.map((echo) => ({
        ...echo,
        chainId: 42161,
      })),
    ];
    // Sort it by particles count
    // c.f. config.calculateParticlesCount(createdAt, expandedCount)
  },
}));
