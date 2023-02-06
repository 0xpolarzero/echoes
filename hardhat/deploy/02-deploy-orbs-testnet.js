const { network, ethers } = require('hardhat');
const {
  developmentChains,
  testnetChains,
  attributes,
  expansionCooldown,
  description,
  backgroundColor,
  externalUrl,
  animationUrl,
  contractUri,
  feeRecipient,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async function({ getNamedAccounts, deployments }) {
  if (
    !developmentChains.includes(network.name) &&
    testnetChains.includes(network.name)
  )
    return;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [
    attributes[0],
    attributes[1],
    attributes[2],
    attributes[3],
    animationUrl,
    description,
    externalUrl,
    JSON.stringify({
      ...contractUri,
      fee_recipient: feeRecipient.test,
    }),
    backgroundColor,
    expansionCooldown,
  ];

  const orbs = await deploy('OrbsTestnet', {
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
    await verify(orbs.address, args);
  }
};

module.exports.tags = ['all', 'testnet', 'main'];
