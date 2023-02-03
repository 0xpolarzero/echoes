const { assert, expect } = require('chai');
const {
  developmentChains,
  attributes,
  name,
  symbol,
  price,
  mintLimit,
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
          // ERC721
          assert.equal(await orbsContract.name(), name);
          assert.equal(await orbsContract.symbol(), symbol);
          assert.equal(await orbsContract.getCurrentTokenId(), 0);
          assert.equal((await orbsContract.getPrice()).toString(), price);
          assert.equal(await orbsContract.getMintLimit(), mintLimit);

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
      describe('Dev Functions', function() {
        const newAttributesIndex = 0;
        const newAttributes = ['test1', 'test2', 'test3'];
        const newExpansionCooldown = 100;
        const newPrice = ethers.utils.parseEther('0.1');
        const newMintLimit = 10;

        it('Should revert if not called by the owner', async () => {
          // addAttributes
          await expect(
            orbsContract
              .connect(user)
              .addAttributes(newAttributesIndex, newAttributes),
          ).to.be.revertedWith(
            'ORBS__NOT_OWNER("Only the owner can call this function")',
          );
          // setExpansionCooldown
          await expect(
            orbsContract.connect(user).setExpansionCooldown(100),
          ).to.be.revertedWith(
            'ORBS__NOT_OWNER("Only the owner can call this function")',
          );
          // setPrice
          await expect(
            orbsContract.connect(user).setPrice(newPrice),
          ).to.be.revertedWith(
            'ORBS__NOT_OWNER("Only the owner can call this function")',
          );
          // setMintLimit
          await expect(
            orbsContract.connect(user).setMintLimit(newMintLimit),
          ).to.be.revertedWith(
            'ORBS__NOT_OWNER("Only the owner can call this function")',
          );
        });

        describe('addAttributes', function() {
          it('Should revert if the attribute index is out of bounds', async () => {
            await expect(
              orbsContract.addAttributes(attributes.length, newAttributes),
            ).to.be.revertedWith(
              'ORBS__ATTRIBUTE_DOES_NOT_EXIST("The attribute type does not exist")',
            );
          });

          it('Should successfully add new attributes to a type and emit the correct event', async () => {
            const tx = await expect(
              await orbsContract.addAttributes(
                newAttributesIndex,
                newAttributes,
              ),
            )
              .to.emit(orbsContract, 'ORBS__ATTRIBUTES_ADDED')
              .withArgs(newAttributesIndex, newAttributes);

            await tx.wait(1);

            assert.equal(
              (
                await orbsContract.getAttributesOfType(newAttributesIndex)
              ).toString(),
              [...attributes[newAttributesIndex], ...newAttributes].toString(),
            );
          });

          it('Should emit the correct event', async () => {
            await expect(
              orbsContract.addAttributes(newAttributesIndex, newAttributes),
            )
              .to.emit(orbsContract, 'ORBS__ATTRIBUTES_ADDED')
              .withArgs(newAttributesIndex, newAttributes);
          });
        });

        describe('setExpansionCooldown', function() {
          it('Should successfully set the expansion cooldown', async () => {
            const tx = await orbsContract.setExpansionCooldown(
              newExpansionCooldown,
            );
            await tx.wait(1);

            assert.equal(
              (await orbsContract.getExpansionCooldown()).toString(),
              newExpansionCooldown.toString(),
            );
          });

          it('Should emit the correct event', async () => {
            await expect(
              orbsContract.setExpansionCooldown(newExpansionCooldown),
            )
              .to.emit(orbsContract, 'ORBS__EXPANSION_COOLDOWN_UPDATED')
              .withArgs(newExpansionCooldown);
          });
        });

        describe('setPrice', function() {
          it('Should successfully set the price', async () => {
            const tx = await orbsContract.setPrice(newPrice);
            await tx.wait(1);

            assert.equal((await orbsContract.getPrice()).toString(), newPrice);
          });

          it('Should emit the correct event', async () => {
            await expect(orbsContract.setPrice(newPrice))
              .to.emit(orbsContract, 'ORBS__PRICE_UPDATED')
              .withArgs(newPrice);
          });
        });

        describe('setMintLimit', function() {
          it('Should successfully set the mint limit', async () => {
            const tx = await orbsContract.setMintLimit(newMintLimit);
            await tx.wait(1);

            assert.equal(await orbsContract.getMintLimit(), newMintLimit);
          });

          it('Should emit the correct event', async () => {
            await expect(orbsContract.setMintLimit(newMintLimit))
              .to.emit(orbsContract, 'ORBS__MINT_LIMIT_UPDATED')
              .withArgs(newMintLimit);
          });
        });
      });
    });
