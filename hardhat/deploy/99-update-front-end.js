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
  const orbsContract = await ethers.getContract('OrbsMainnet');
  const chainId = network.config.chainId;

  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, 'utf8'),
  );
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]['OrbsMainnet'].includes(orbsContract.address)
    ) {
      contractAddresses[chainId]['OrbsMainnet'].push(orbsContract.address);
    }
  } else {
    contractAddresses[chainId] = {
      OrbsMainnet: [orbsContract.address],
    };
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));

  console.log('Front end updated!');
}

async function updateAbi() {
  const orbsContract = await ethers.getContract('OrbsMainnet');
  fs.writeFileSync(
    `${frontEndAbiFolder}OrbsMainnet.json`,
    orbsContract.interface.format(ethers.utils.FormatTypes.json),
  );
}

module.exports.tags = ['all', 'frontend'];
