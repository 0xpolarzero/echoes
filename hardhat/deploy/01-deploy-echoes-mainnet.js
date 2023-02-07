const { network, ethers } = require('hardhat');
const {
  developmentChains,
  testnetChains,
  attributes,
  spectrumColors,
  sceneryColors,
  expansionCooldown,
  description,
  externalUrl,
  animationUrl,
  encodedContractUri,
  price,
  mintLimit,
  maxSupply,
  maxSupplyMock,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async function({ getNamedAccounts, deployments }) {
  if (
    !developmentChains.includes(network.name) &&
    testnetChains.includes(network.config.chainId)
  )
    return;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [
    attributes[0],
    attributes[1],
    attributes[2],
    attributes[3],
    spectrumColors,
    sceneryColors,
    [animationUrl, externalUrl, description, encodedContractUri],
    expansionCooldown,
    [
      price,
      mintLimit,
      developmentChains.includes(network.name) ? maxSupplyMock : maxSupply,
    ],
  ];

  const echoes = await deploy('EchoesMainnet', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log('Verifying contract...');
    await verify(echoes.address, args);
  }
};

module.exports.tags = ['all', 'mainnet', 'main'];
