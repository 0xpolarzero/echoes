import { gql } from '@apollo/client';

const getEchoes = (apiName) => gql`
  query GetEchoes @api(name: ${apiName}) {
    echos(first: 1000) {
      id
      owner
      tokenId
      signature
      createdAt
      lastExpandedAt
      expandedCount
    }
  }
`;

const GET_ECHOS_ETHEREUM_GOERLI = getEchoes('ethereumGoerli');
const GET_ECHOS_POLYGON_MUMBAI = getEchoes('polygonMumbai');
const GET_ECHOS_ARBITRUM_GOERLI = getEchoes('arbitrumGoerli');

const queries = {
  GET_ECHOS_ETHEREUM_GOERLI,
  GET_ECHOS_POLYGON_MUMBAI,
  GET_ECHOS_ARBITRUM_GOERLI,
};

export default queries;
