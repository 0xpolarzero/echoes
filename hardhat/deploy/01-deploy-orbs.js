const { network, ethers } = require('hardhat');
const {
  developmentChains,
  attributes,
  maxExpansion,
  description,
  backgroundColor,
  externalUrl,
  animationUrl,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Convert to bytes
  const descriptionBytes = ethers.utils.formatBytes32String(description);
  const externalUrlBytes = ethers.utils.formatBytes32String(externalUrl);

  const args = [
    attributes.spectrum,
    attributes.scenery,
    attributes.trace,
    attributes.atmosphere,
    animationUrl,
    externalUrlBytes,
    descriptionBytes,
    backgroundColor,
    maxExpansion,
  ];

  const orbs = await deploy('OrbsContract', {
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

module.exports.tags = ['all', 'orbs', 'main'];
