const { assert, expect } = require('chai');
const {
  developmentChains,
  attributes,
  name,
  symbol,
  description,
  externalUrl,
  animationUrl,
  expansionCooldown,
  BASE_EXPANSE,
  MAX_EXPANSION,
  backgroundColor,
  contractUri,
} = require('../../helper-hardhat-config');
const { deployments, network, ethers } = require('hardhat');
const mineBlocks = require('../../scripts/mineBlocks');

/**
 * @notice This contract being the same as the mainnet one, we only need to test the differences,
 * which are the price (free on testnet), the mint limit per wallet (no limit) and the max supply (no limit)
 * We can actually only test the price here, the rest being removed from the contract,
 * there are no revert/exceptions to test
 * @dev The test cases are identical, we just removed the mintLimit and maxSupply ones,
 * and removed the price from the arguments
 */

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OrbsTestnet unit tests', function() {
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
        orbsContract = await ethers.getContract('OrbsTestnet', deployer);
        orbsContractUser = await ethers.getContract('OrbsTestnet', user);
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

          assert.equal(await orbsContract.getOwner(), deployer.address);
          assert.equal(
            (await orbsContract.getCreationTimestamp()).toString(),
            (
              await ethers.provider.getBlock(
                deployTx.OrbsTestnet.receipt.blockNumber,
              )
            ).timestamp.toString(),
          );

          // Metadata
          assert.equal(await orbsContract.getExternalUrl(), externalUrl);
          assert.equal(await orbsContract.getDescription(), description);
          assert.equal(await orbsContract.getAnimationUrl(), animationUrl);
          assert.equal(
            await orbsContract.contractURI(),
            JSON.stringify(contractUri),
          );

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
            (await orbsContract.getBaseExpanse()).toString(),
            BASE_EXPANSE.toString(),
          );
          assert.equal(
            (await orbsContract.getMaxExpansion()).toString(),
            MAX_EXPANSION.toString(),
          );
        });
      });

      /**
       * @notice Mint
       */
      describe('mint', function() {
        const args = ['Name of the orb', 0, 0, 0, 0]; // signature + attributes indexes

        describe('Should revert if any verification fails', function() {
          it('signature not provided', async () => {
            await expect(
              orbsContractUser.mint('', 0, 0, 0, 0),
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
              orbsContractUser.mint('Name', attributes[0].length, 0, 0, 0),
            ).to.be.revertedWith(
              `ORBS__INVALID_ATTRIBUTE("The attribute does not exist")`,
            );
          });
        });

        describe('Should successfully mint and update all storage states', function() {
          const signature = 'Name of the orb';
          const args = [signature, 0, 0, 0, 0];
          const chosenAttributes = [
            attributes[0][args[1]],
            attributes[1][args[2]],
            attributes[2][args[3]],
            attributes[3][args[4]],
          ];
          let timestamp;

          beforeEach(async () => {
            const mint = await orbsContractUser.mint(...args);
            const mintTx = await mint.wait(1);
            timestamp = (await mintTx.events[0].getBlock()).timestamp;
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

            assert.equal(orb.signature, signature);
            assert.equal(
              orb.attributes.toString(),
              chosenAttributes.toString(),
            );
            assert.equal(orb.expansionRate.toString(), '1');
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
          it('correct tokenURI set', async () => {
            const tokenURI = await orbsContract.tokenURI(1);
            const decoded = Buffer.from(
              tokenURI.split(',')[1],
              'base64',
            ).toString('ascii');
            const json = JSON.parse(decoded);

            // See at the bottom of the file for the full test
            testTokenUri(json, 1, chosenAttributes, signature, timestamp);
          });

          it('correct orbs mapping set', async () => {
            const orb = await orbsContract.getOrb('1');

            assert.equal(orb.tokenId.toString(), '1');
            assert.equal(orb.owner, user.address);
            assert.equal(orb.signature, signature);
            assert.equal(
              orb.attributes.toString(),
              chosenAttributes.toString(),
            );
            assert.equal(orb.expansionRate.toString(), '1');
            assert.equal(
              orb.lastExpansionTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(
              orb.creationTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(orb.maxExpansionReached, false);
          });

          it('correct signature added to the array', async () => {
            const isAvailable = await orbsContract.isSignatureAvailable(
              signature,
            );
            assert(!isAvailable);
          });

          it('correct event emitted', async () => {
            const newSignature = 'Other name';
            await expect(orbsContractUser.mint(newSignature, 0, 0, 0, 0))
              .to.emit(orbsContract, 'ORBS__MINTED')
              .withArgs(user.address, 2, newSignature);
          });
        });
      });

      /**
       * @notice Expand
       */
      describe('expand', function() {
        beforeEach(async () => {
          await orbsContractUser.mint('Name of the orb', 0, 0, 0, 0);
        });

        describe('Should revert if any verification fails', function() {
          it("doesn't exist", async () => {
            await expect(orbsContractUser.expand(2)).to.be.revertedWith(
              "'ORBS__DOES_NOT_EXIST(2)'",
            );
          });
          it('not owner', async () => {
            const expectedOwner = await orbsContract.ownerOf(1);

            await expect(orbsContract.expand(1)).to.be.revertedWith(
              `'ORBS__NOT_OWNER("${expectedOwner}", "${deployer.address}")'`,
            );
          });
          it('in expansion cooldown', async () => {
            const lastExpansionTimestamp = (await orbsContract.getOrb(1))
              .lastExpansionTimestamp;

            await expect(orbsContractUser.expand(1)).to.be.revertedWith(
              `'ORBS__IN_EXPANSION_COOLDOWN(${expansionCooldown}, ${lastExpansionTimestamp})'`,
            );
          });
          it('max expansion reached', async () => {
            await orbsContract.setExpansionCooldown(0);
            // Pass two days to get a higher multiplier
            const twoDaysInBlocks = (2 * 24 * 60 * 60) / 13;
            await mineBlocks(twoDaysInBlocks);

            let reached;
            // Expand until max expansion reached
            while (!reached) {
              await orbsContractUser.expand(1);
              reached = (await orbsContract.getOrb(1)).maxExpansionReached;
            }

            // Try to expand again
            await expect(orbsContractUser.expand(1)).to.be.revertedWith(
              `'ORBS__MAX_EXPANSION_REACHED(1)'`,
            );
          });
        });

        describe('Should successfully expand and update all storage states', function() {
          // maxExpansionReached is correctly set considering the previous test
          it('correct expansionRate', async () => {
            await orbsContract.setExpansionCooldown(0);
            const expansionRate = (await orbsContract.getOrb(1)).expansionRate;
            await orbsContractUser.expand(1);
            const newExpansionRate = (await orbsContract.getOrb(1))
              .expansionRate;

            assert.equal(newExpansionRate.toString(), expansionRate.add(1));
          });
          it('correct lastExpansionTimestamp', async () => {
            await orbsContract.setExpansionCooldown(0);
            const tx = await orbsContractUser.expand(1);
            const receipt = await tx.wait(1);
            const lastExpansionTimestamp = (await orbsContract.getOrb(1))
              .lastExpansionTimestamp;

            assert.equal(
              lastExpansionTimestamp.toString(),
              (await receipt.events[0].getBlock()).timestamp.toString(),
            );
          });
          // Correct event emitted
          it('correct event emitted', async () => {
            await orbsContract.setExpansionCooldown(0);
            const signature = (await orbsContract.getOrb(1)).signature;

            await expect(orbsContractUser.expand(1))
              .to.emit(orbsContract, 'ORBS__EXPANDED')
              .withArgs(user.address, 1, signature);
          });
        });
      });

      /**
       * @notice Dev functions
       */
      const newAttributesIndex = 0;
      const newAttributes = ['test1', 'test2', 'test3'];
      const newExpansionCooldown = 100;

      describe('[dev functions] - Ownable', function() {
        it('Should revert if not called by the owner', async () => {
          // addAttributes
          await expect(
            orbsContract
              .connect(user)
              .addAttributes(newAttributesIndex, newAttributes),
          ).to.be.revertedWith('Ownable: caller is not the owner');
          // setExpansionCooldown
          await expect(
            orbsContract.connect(user).setExpansionCooldown(100),
          ).to.be.revertedWith('Ownable: caller is not the owner');
          // setContractURI
          await expect(
            orbsContract.connect(user).setContractURI('test'),
          ).to.be.revertedWith('Ownable: caller is not the owner');
        });
      });

      describe('[dev functions] - addAttributes', function() {
        it('Should revert if the attribute index is out of bounds', async () => {
          await expect(
            orbsContract.addAttributes(attributes.length, newAttributes),
          ).to.be.revertedWith(
            'ORBS__INVALID_ATTRIBUTE("The attributes type does not exist")',
          );
        });

        it('Should successfully add new attributes to a type and emit the correct event', async () => {
          await expect(
            await orbsContract.addAttributes(newAttributesIndex, newAttributes),
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

      describe('[dev functions] - setExpansionCooldown', function() {
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

      describe('[dev functions] - setContractURI (OpenSea)', function() {
        it('Should successfully update the contract URI and emit the correct event', async () => {
          await expect(await orbsContract.setContractURI('test'))
            .to.emit(orbsContract, 'ORBS__CONTRACT_URI_UPDATED')
            .withArgs('test');

          assert.equal(await orbsContract.contractURI(), 'test');
        });
      });
    });

const testTokenUri = (
  json,
  tokenId,
  chosenAttributes,
  signature,
  timestamp,
) => {
  // Base
  assert.equal(json.description, description, 'description');
  assert.equal(json.name, signature, 'name');
  // We can't really test the SVG here, so we just check if it exists
  assert(json.image_data.includes('data:image/svg+xml;base64,'), 'image_data');
  assert.equal(json.external_url, externalUrl + tokenId, 'external_url');
  assert.equal(json.background_color, backgroundColor, 'background_color');

  // Animation url
  const expectedAnimationUrl = `${animationUrl}&0=${attributes[0].indexOf(
    chosenAttributes[0],
  )}&1=${attributes[1].indexOf(chosenAttributes[1])}&2=${attributes[2].indexOf(
    chosenAttributes[2],
  )}&3=${attributes[3].indexOf(chosenAttributes[3])}&4=${BASE_EXPANSE}`;
  assert.equal(json.animation_url, expectedAnimationUrl, 'animation_url');

  // Attributes
  const attributesTypes = [
    'Spectrum',
    'Scenery',
    'Trace',
    'Atmosphere',
    'Generation',
    'Expanse',
    'Last Expansion',
    'Max Expanse',
  ];
  const attributesValues = [
    ...chosenAttributes,
    timestamp.toString(),
    BASE_EXPANSE,
    timestamp.toString(),
    'false',
  ];

  for (let i = 0; i < attributesValues.length; i++) {
    // Type
    assert.equal(
      json.attributes[i].trait_type,
      attributesTypes[i],
      `trait_type ${attributesTypes[i]}`,
    );
    // Value
    assert.equal(
      json.attributes[i].value,
      attributesValues[i],
      `value ${attributesTypes[i]}`,
    );
  }
};
