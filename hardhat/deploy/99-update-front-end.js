const { ethers, network } = require('hardhat');
const fs = require('fs');
const { testnetChains } = require('../helper-hardhat-config');

const frontEndContractsFile = '../frontend/data/constants/networkMapping.json';
const frontEndAbiFolder = '../frontend/data/constants/';

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating front end...');
    await updateContractAddresses();
    await updateAbi();
  }
};

async function updateContractAddresses() {
  const orbsMainnet = await ethers.getContract('OrbsMainnet');
  const orbsTestnet = await ethers.getContract('OrbsTestnet');
  const chainId = network.config.chainId;

  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, 'utf8'),
  );

  if (testnetChains.includes(chainId)) {
    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId]['Orbs'].includes(orbsTestnet.address))
        contractAddresses[chainId]['Orbs'].push(orbsTestnet.address);
    } else {
      contractAddresses[chainId] = {
        Orbs: [orbsTestnet.address],
      };
    }
  } else {
    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId]['Orbs'].includes(orbsMainnet.address))
        contractAddresses[chainId]['Orbs'].push(orbsMainnet.address);
    } else {
      contractAddresses[chainId] = {
        Orbs: [orbsMainnet.address],
      };
    }
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));

  console.log('Front end updated!');
}

async function updateAbi() {
  const orbsMainnet = await ethers.getContract('OrbsMainnet');
  fs.writeFileSync(
    `${frontEndAbiFolder}OrbsMainnet.json`,
    orbsMainnet.interface.format(ethers.utils.FormatTypes.json),
  );

  const orbsTestnet = await ethers.getContract('OrbsTestnet');
  fs.writeFileSync(
    `${frontEndAbiFolder}OrbsTestnet.json`,
    orbsTestnet.interface.format(ethers.utils.FormatTypes.json),
  );
}

module.exports.tags = ['all', 'frontend'];
