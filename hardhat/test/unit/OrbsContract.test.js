const { assert, expect } = require('chai');
const {
  developmentChains,
  attributes,
  name,
  symbol,
  maxSupply,
  description,
  externalUrl,
  animationUrl,
  expansionCooldown,
  BASE_EXPANSION,
  MAX_EXPANSION,
  MAX_SUPPLY,
} = require('../../helper-hardhat-config');
const { deployments, network, ethers } = require('hardhat');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OrbsContract unit tests', function() {
      let deployer;
      let user;
      let orbsContract;
      let deployTx;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        deployTx = await deployments.fixture(['main']);
        orbsContract = await ethers.getContract('OrbsContract', deployer);
      });

      /**
       * @notice Constructor
       */
      describe('constructor', function() {
        it('Should initialize the variables with the right value', async () => {
          // name & symbol
          // _tokenIds at 0
          // owner & creation date
          // Metadata: externalurl, description, animationurl
          // Systems: expansioncooldown
          // Attributes: attributes
          // Constants: base expansion & max expansion & max supply

          // ERC721
          assert.equal(await orbsContract.name(), name);
          assert.equal(await orbsContract.symbol(), symbol);
          assert.equal(await orbsContract.getCurrentTokenId(), 0);

          assert.equal(await orbsContract.getOwner(), deployer.address);
          assert.equal(
            (await orbsContract.getCreationTimestamp()).toString(),
            (
              await ethers.provider.getBlock(
                deployTx.OrbsContract.receipt.blockNumber,
              )
            ).timestamp.toString(),
          );

          // Metadata
          assert.equal(await orbsContract.getExternalUrl(), externalUrl);
          assert.equal(await orbsContract.getDescription(), description);
          assert.equal(await orbsContract.getAnimationUrl(), animationUrl);

          // Systems
          assert.equal(
            (await orbsContract.getExpansionCooldown()).toString(),
            expansionCooldown.toString(),
          );

          // Attributes
          for (let i = 0; i < attributes.length; i++) {
            assert.equal(
              (await orbsContract.getAttributesOfType(i)).toString(),
              attributes[i].toString(),
            );
          }

          // Constants
          assert.equal(
            (await orbsContract.getBaseExpansion()).toString(),
            BASE_EXPANSION.toString(),
          );
          assert.equal(
            (await orbsContract.getMaxExpansion()).toString(),
            MAX_EXPANSION.toString(),
          );
          assert.equal(
            (await orbsContract.getMaxSupply()).toString(),
            MAX_SUPPLY.toString(),
          );
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
