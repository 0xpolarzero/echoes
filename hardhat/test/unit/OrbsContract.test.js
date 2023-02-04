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
            const newLimit = 1;
            await orbsContract.setMintLimit(newLimit);
            await orbsContractUser.mint(...args);
            await expect(orbsContractUser.mint(...args)).to.be.revertedWith(
              `ORBS__MINT_LIMIT_REACHED(${newLimit})`,
            );
            await orbsContract.setMintLimit(mintLimit); // during unit tests is set to 10 instead of 1000
          });
          it('max supply reached', async () => {
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
            await expect(
              orbsContractUser.mint('', 0, 0, 0, 0, { value: price }),
            ).to.be.revertedWith(
              `ORBS__INVALID_ATTRIBUTE("Signature is empty")`,
            );
          });
          it('signature already used', async () => {
            await orbsContract.mint(...args);
            await expect(orbsContractUser.mint(...args)).to.be.revertedWith(
              `ORBS__SIGNATURE_ALREADY_USED("${args[0]}")`,
            );
          });
          it('attribute index out of bounds (does not exist)', async () => {
            await expect(
              orbsContractUser.mint('Name', attributes[0].length, 0, 0, 0, {
                value: price,
              }),
            ).to.be.revertedWith(
              `ORBS__INVALID_ATTRIBUTE("The attribute does not exist")`,
            );
          });
        });

        describe('Should successfully mint and update all storage states', function() {
          const signature = 'Name of the orb';
          const args = [signature, 0, 0, 0, 0, { value: price }];
          const chosedAttributes = [
            attributes[0][args[1]],
            attributes[1][args[2]],
            attributes[2][args[3]],
            attributes[3][args[4]],
          ];
          let mintTx;

          beforeEach(async () => {
            const mint = await orbsContractUser.mint(...args);
            mintTx = await mint.wait(1);
          });

          it('correct amount of tokens minted', async () => {
            assert.equal(
              (await orbsContract.balanceOf(user.address)).toString(),
              '1',
            );
          });
          it('current token id incremented', async () => {
            assert.equal(
              (await orbsContract.getCurrentTokenId()).toString(),
              '1',
            );
          });
          it('correct owner set', async () => {
            assert.equal(await orbsContract.ownerOf(1), user.address);
          });

          it('correct orb created', async () => {
            const orb = await orbsContract.getOrb(1);
            const timestamp = (await mintTx.events[0].getBlock()).timestamp;

            assert.equal(orb.signature, signature);
            assert.equal(
              orb.attributes.toString(),
              chosedAttributes.toString(),
            );
            assert.equal(orb.expansionMultiplier.toString(), '1');
            assert.equal(
              orb.lastExpansionTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(
              orb.creationTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(orb.maxExpansionReached, false);
            assert.equal(orb.tokenId.toString(), '1');
          });
          // Should set the tokenURI with the right json metadata
          it('correct tokenURI set', async () => {
            const tokenURI = await orbsContract.tokenURI(1);
            const decoded = Buffer.from(
              tokenURI.split(',')[1],
              'base64',
            ).toString('ascii');
            console.log(decoded);
          });
          //
          // Should add the orb to the mapping
          // Should add the signature to the array
          //
          // Should emit the correct event
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
