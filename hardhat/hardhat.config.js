require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('dotenv').config();

const ETHEREUM_MAINNET_RPC_URL = process.env.ETHEREUM_MAINNET_RPC_URL;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
const TEST_PRIVATE_KEY_SECOND = process.env.TEST_PRIVATE_KEY_SECOND;
const PROD_PRIVATE_KEY = process.env.PROD_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
    ethereum: {
      url: ETHEREUM_MAINNET_RPC_URL,
      accounts: [PROD_PRIVATE_KEY],
      chainId: 1,
      blockConfirmations: 5,
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: [TEST_PRIVATE_KEY, TEST_PRIVATE_KEY_SECOND],
      chainId: 80001,
      blockConfirmations: 5,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: {
      ethereum: ETHERSCAN_API_KEY,
      mumbai: POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'ethereum',
        chainId: 1,
        urls: {
          apiURL: 'https://api.etherscan.io/api',
          browserURL: 'https://etherscan.io',
        },
      },
      {
        network: 'mumbai',
        chainId: 80001,
        urls: {
          apiURL: 'https://api-mumbai.polygonscan.com/api',
          browserURL: 'https://mumbai.polygonscan.com',
        },
      },
    ],
  },
  gasReporter: {
    enabled: false,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 300000,
  },
};
