const { ethers, network } = require('hardhat');
const fs = require('fs');

const frontEndContractsFile = '../frontend/constants/networkMapping.json';
const frontEndAbiFolder = '../frontend/constants/';

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
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]['OrbsMainnet'].includes(orbsMainnet.address)
    ) {
      contractAddresses[chainId]['OrbsMainnet'].push(orbsMainnet.address);
    }
    if (
      !contractAddresses[chainId]['OrbsTestnet'].includes(orbsTestnet.address)
    ) {
      contractAddresses[chainId]['OrbsTestnet'].push(orbsTestnet.address);
    }
  } else {
    contractAddresses[chainId] = {
      OrbsMainnet: [orbsMainnet.address],
      OrbsTestnet: [orbsTestnet.address],
    };
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
