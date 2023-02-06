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
  price,
  mintLimit,
  maxSupply,
  maxSupplyMock,
  feeRecipient,
} = require('../helper-hardhat-config');
const getTraits = require('../scripts/getTraits');
const { verify } = require('../utils/verify');

module.exports = async function({ getNamedAccounts, deployments }) {
  if (
    !developmentChains.includes(network.name) &&
    testnetChains.includes(network.name)
  )
    return;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Encode json contract uri in base64 after prepending the data type
  const encodedContractUri =
    'data:application/json;base64,' +
    Buffer.from(
      JSON.stringify({
        ...contractUri,
        fee_recipient: developmentChains.includes(network.name)
          ? feeRecipient.test
          : feeRecipient.prod,
      }),
    ).toString('base64');

  // Get the colors
  const { spectrum, scenery } = getTraits();

  const args = [
    attributes[0],
    attributes[1],
    attributes[2],
    attributes[3],
    spectrum,
    scenery,
    [animationUrl, externalUrl, description, encodedContractUri],
    expansionCooldown,
    [
      price,
      mintLimit,
      developmentChains.includes(network.name) ? maxSupplyMock : maxSupply,
    ],
  ];

  const orbs = await deploy('OrbsMainnet', {
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

module.exports.tags = ['all', 'mainnet', 'main'];
