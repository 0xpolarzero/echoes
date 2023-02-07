const { ethers, network } = require('hardhat');
const fs = require('fs');
const {
  developmentChains,
  testnetChains,
} = require('../helper-hardhat-config');

const frontEndContractsFile =
  '../frontend/src/data/constants/networkMapping.json';
const frontEndAbiFolder = '../frontend/src/data/constants/';

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating front end...');
    const chainId = network.config.chainId;
    await updateContractAddresses(chainId);
    await updateAbi(chainId);
  }
};

async function updateContractAddresses(chainId) {
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, 'utf8'),
  );

  if (testnetChains.includes(chainId)) {
    const echoesTestnet = await ethers.getContract('EchoesTestnet');

    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId]['Echoes'].includes(echoesTestnet.address))
        contractAddresses[chainId]['Echoes'].push(echoesTestnet.address);
    } else {
      contractAddresses[chainId] = {
        Echoes: [echoesTestnet.address],
      };
    }
  } else {
    const echoesMainnet = await ethers.getContract('EchoesMainnet');

    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId]['Echoes'].includes(echoesMainnet.address))
        contractAddresses[chainId]['Echoes'].push(echoesMainnet.address);
    } else {
      contractAddresses[chainId] = {
        Echoes: [echoesMainnet.address],
      };
    }
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));

  console.log('Front end updated!');
}

async function updateAbi(chainId) {
  if (testnetChains.includes(chainId)) {
    const echoesTestnet = await ethers.getContract('EchoesTestnet');
    fs.writeFileSync(
      `${frontEndAbiFolder}EchoesTestnet.json`,
      echoesTestnet.interface.format(ethers.utils.FormatTypes.json),
    );
  } else {
    const echoesMainnet = await ethers.getContract('EchoesMainnet');
    fs.writeFileSync(
      `${frontEndAbiFolder}EchoesMainnet.json`,
      echoesMainnet.interface.format(ethers.utils.FormatTypes.json),
    );
  }
}

module.exports.tags = ['all', 'frontend'];
