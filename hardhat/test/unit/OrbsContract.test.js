const { assert, expect } = require('chai');
const { developmentChains } = require('../../helper-hardhat-config');
const { deployments, network, ethers } = require('hardhat');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OrbsContract unit tests', function() {
      let deployer;
      let user;
      let orbsContract;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(['main']);
        orbsContract = await ethers
          .getContract('OrbsContract')
          .connect(deployer);
      });

      /**
       * @notice Constructor
       */
      describe('constructor', function() {
        it('Should initialize the variables with the right value', async () => {
          // name & symbol
          // _tokenIds
        });
      });

      /**
       * @notice Dev functions
       */
      describe('addAttributes', function() {
        //
      });

      describe('setExpansionCooldown', function() {
        //
      });
    });
