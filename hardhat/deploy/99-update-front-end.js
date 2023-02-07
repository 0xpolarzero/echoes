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
      if (!contractAddresses[chainId]['Echoes'].includes(orbsTestnet.address))
        contractAddresses[chainId]['Echoes'].push(orbsTestnet.address);
    } else {
      contractAddresses[chainId] = {
        Echoes: [orbsTestnet.address],
      };
    }
  } else {
    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId]['Echoes'].includes(orbsMainnet.address))
        contractAddresses[chainId]['Echoes'].push(orbsMainnet.address);
    } else {
      contractAddresses[chainId] = {
        Echoes: [orbsMainnet.address],
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
