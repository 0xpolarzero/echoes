const { assert, expect } = require('chai');
const {
  developmentChains,
  attributes,
  name,
  symbol,
  price,
  mintLimit,
  maxSupply,
  maxSupplyMock,
  description,
  externalUrl,
  animationUrl,
  expansionCooldown,
  BASE_EXPANSION,
  MAX_EXPANSION,
} = require('../../helper-hardhat-config');
const { deployments, network, ethers } = require('hardhat');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OrbsContract unit tests', function() {
      let deployer;
      let user;
      let orbsContract;
      let orbsContractUser;
      let deployTx;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        deployTx = await deployments.fixture(['main']);
        orbsContract = await ethers.getContract('OrbsContract', deployer);
        orbsContractUser = await ethers.getContract('OrbsContract', user);
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
            maxSupply.toString(),
          );
        });
      });

      /**
       * @notice Mint
       */
      describe.only('mint', function() {
        const argsNoPrice = ['Name of the orb', 0, 0, 0, 0]; // signature + attributes indexes
        const args = [...argsNoPrice, { value: price }];

        describe('Should revert if any verification fails', function() {
          it('price not paid', async () => {
            await expect(
              orbsContractUser.mint(...argsNoPrice),
            ).to.be.revertedWith(`ORBS__INVALID_PRICE(${0}, ${price})`);
          });
          it('mint limit reached', async () => {
            const newLimit = 0;
            await orbsContract.setMintLimit(newLimit);
            await expect(orbsContractUser.mint(...args)).to.be.revertedWith(
              `ORBS__MINT_LIMIT_REACHED(${newLimit})`,
            );
          });
          it('max supply reached', async () => {
            await orbsContract.setMintLimit(maxSupplyMock); // during unit tests is set to 10 instead of 1000
            for (let i = 0; i < maxSupplyMock; i++) {
              await orbsContract.mint(`Name of the orb ${i}`, 0, 0, 0, 0, {
                value: price,
              });
            }
            await expect(orbsContractUser.mint(...args)).to.be.revertedWith(
              `ORBS__MAX_SUPPLY_REACHED(${maxSupplyMock})`,
            );
          });
          it('signature not provided', async () => {
            //
          });
          it('signature already used', async () => {
            //
          });
          it('attribute index out of bounds (does not exist)', async () => {
            //
          });
        });
        //
        // Should mint the correct amount of tokens
        // Should increment the current token id
        // Should set the correct owner
        //
        // Should create the correct orb (signature, attributes, expansionMultiplier, lastExpansionTimestamp, creationTimestamp, maxExpansionReached, tokenId)
        // Should set the tokenURI with the right json metadata
        //
        // Should add the orb to the mapping
        // Should add the signature to the array
        //
        // Should emit the correct event
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
              'ORBS__INVALID_ATTRIBUTE("The attributes type does not exist")',
            );
          });

          it('Should successfully add new attributes to a type and emit the correct event', async () => {
            await expect(
              await orbsContract.addAttributes(
                newAttributesIndex,
                newAttributes,
              ),
            )
              .to.emit(orbsContract, 'ORBS__ATTRIBUTES_ADDED')
              .withArgs(newAttributesIndex, newAttributes);

            assert.equal(
              (
                await orbsContract.getAttributesOfType(newAttributesIndex)
              ).toString(),
              [...attributes[newAttributesIndex], ...newAttributes].toString(),
            );
          });
        });

        describe('setExpansionCooldown', function() {
          it('Should successfully set the expansion cooldown and emit the correct event', async () => {
            await expect(
              await orbsContract.setExpansionCooldown(newExpansionCooldown),
            )
              .to.emit(orbsContract, 'ORBS__EXPANSION_COOLDOWN_UPDATED')
              .withArgs(newExpansionCooldown);

            assert.equal(
              (await orbsContract.getExpansionCooldown()).toString(),
              newExpansionCooldown.toString(),
            );
          });
        });

        describe('setPrice', function() {
          it('Should successfully set the price and emit the correct event', async () => {
            await expect(await orbsContract.setPrice(newPrice))
              .to.emit(orbsContract, 'ORBS__PRICE_UPDATED')
              .withArgs(newPrice);

            assert.equal(
              (await orbsContract.getPrice()).toString(),
              newPrice.toString(),
            );
          });
        });

        describe('setMintLimit', function() {
          it('Should successfully set the mint limit and emit the correct event', async () => {
            await expect(await orbsContract.setMintLimit(newMintLimit))
              .to.emit(orbsContract, 'ORBS__MINT_LIMIT_UPDATED')
              .withArgs(newMintLimit);

            assert.equal(
              (await orbsContract.getMintLimit()).toString(),
              newMintLimit.toString(),
            );
          });
        });
      });
    });
