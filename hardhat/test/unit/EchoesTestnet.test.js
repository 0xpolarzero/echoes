const { deployments, network, ethers } = require('hardhat');
const { assert, expect } = require('chai');
const {
  developmentChains,
  attributes,
  spectrumColors,
  sceneryColors,
  name,
  symbol,
  description,
  externalUrl,
  animationUrl,
  expansionCooldown,
  BASE_EXPANSE,
  MAX_EXPANSION,
  encodedContractUri,
} = require('../../helper-hardhat-config');
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
  : describe('EchoesTestnet unit tests', function() {
      let deployer;
      let user;
      let echoesContract;
      let echoesContractUser;
      let deployTx;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        deployTx = await deployments.fixture(['main']);
        echoesContract = await ethers.getContract('EchoesTestnet', deployer);
        echoesContractUser = await ethers.getContract('EchoesTestnet', user);
      });

      /**
       * @notice Constructor
       */
      describe('constructor', function() {
        it('Should initialize the variables with the right value', async () => {
          // ERC721
          assert.equal(await echoesContract.name(), name);
          assert.equal(await echoesContract.symbol(), symbol);
          assert.equal(await echoesContract.getCurrentTokenId(), 0);

          assert.equal(await echoesContract.getOwner(), deployer.address);
          assert.equal(
            (await echoesContract.getCreationTimestamp()).toString(),
            (
              await ethers.provider.getBlock(
                deployTx.EchoesTestnet.receipt.blockNumber,
              )
            ).timestamp.toString(),
          );

          // Metadata
          assert.equal(await echoesContract.getExternalUrl(), externalUrl);
          assert.equal(await echoesContract.getDescription(), description);
          assert.equal(await echoesContract.getAnimationUrl(), animationUrl);
          assert.equal(await echoesContract.contractURI(), encodedContractUri);
          assert.sameOrderedMembers(
            await echoesContract.getSpectrumColors(),
            spectrumColors,
          );
          assert.sameOrderedMembers(
            await echoesContract.getSceneryColors(),
            sceneryColors,
          );

          // Systems
          assert.equal(
            (await echoesContract.getExpansionCooldown()).toString(),
            expansionCooldown.toString(),
          );

          // Attributes
          for (let i = 0; i < attributes.length; i++) {
            assert.equal(
              (await echoesContract.getAttributesOfType(i)).toString(),
              attributes[i].toString(),
            );
          }

          // Constants
          assert.equal(
            (await echoesContract.getBaseExpanse()).toString(),
            BASE_EXPANSE.toString(),
          );
          assert.equal(
            (await echoesContract.getMaxExpansion()).toString(),
            MAX_EXPANSION.toString(),
          );
        });
      });

      /**
       * @notice Mint
       */
      describe('mint', function() {
        const args = ['Name of the echo', 0, 0, 0, 0]; // signature + attributes indexes

        describe('Should revert if any verification fails', function() {
          it('signature not provided', async () => {
            await expect(
              echoesContractUser.mint('', 0, 0, 0, 0),
            ).to.be.revertedWith(
              `ECHOES__INVALID_ATTRIBUTE("Signature is empty")`,
            );
          });
          it('signature already used', async () => {
            await echoesContract.mint(...args);
            await expect(echoesContractUser.mint(...args)).to.be.revertedWith(
              `ECHOES__SIGNATURE_ALREADY_USED("${args[0]}")`,
            );
          });
          it('attribute index out of bounds (does not exist)', async () => {
            await expect(
              echoesContractUser.mint('Name', attributes[0].length, 0, 0, 0),
            ).to.be.revertedWith(
              `ECHOES__INVALID_ATTRIBUTE("The attribute does not exist")`,
            );
          });
        });

        describe('Should successfully mint and update all storage states', function() {
          const signature = 'Name of the echo';
          const args = [signature, 0, 0, 0, 0];
          const chosenAttributes = [
            attributes[0][args[1]],
            attributes[1][args[2]],
            attributes[2][args[3]],
            attributes[3][args[4]],
          ];
          let timestamp;

          beforeEach(async () => {
            const mint = await echoesContractUser.mint(...args);
            const mintTx = await mint.wait(1);
            timestamp = (await mintTx.events[0].getBlock()).timestamp;
          });

          it('correct amount of tokens minted', async () => {
            assert.equal(
              (await echoesContract.balanceOf(user.address)).toString(),
              '1',
            );
          });
          it('current token id incremented', async () => {
            assert.equal(
              (await echoesContract.getCurrentTokenId()).toString(),
              '1',
            );
          });
          it('correct owner set', async () => {
            assert.equal(await echoesContract.ownerOf(1), user.address);
          });

          it('correct echo created', async () => {
            const echo = await echoesContract.getEcho(1);

            assert.equal(echo.signature, signature);
            assert.equal(
              echo.attributes.toString(),
              chosenAttributes.toString(),
            );
            assert.equal(echo.expansionRate.toString(), '1');
            assert.equal(
              echo.lastExpansionTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(
              echo.creationTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(echo.maxExpansionReached, false);
            assert.equal(echo.tokenId.toString(), '1');
          });
          it('correct tokenURI set', async () => {
            const tokenURI = await echoesContract.tokenURI(1);
            const decoded = Buffer.from(
              tokenURI.split(',')[1],
              'base64',
            ).toString('ascii');
            const json = JSON.parse(decoded);

            // See at the bottom of the file for the full test
            testTokenUri(json, 1, chosenAttributes, signature, timestamp);
          });

          it('correct echoes mapping set', async () => {
            const echo = await echoesContract.getEcho('1');

            assert.equal(echo.tokenId.toString(), '1');
            assert.equal(echo.owner, user.address);
            assert.equal(echo.signature, signature);
            assert.equal(
              echo.attributes.toString(),
              chosenAttributes.toString(),
            );
            assert.equal(echo.expansionRate.toString(), '1');
            assert.equal(
              echo.lastExpansionTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(
              echo.creationTimestamp.toString(),
              timestamp.toString(),
            );
            assert.equal(echo.maxExpansionReached, false);
          });

          it('correct signature added to the array', async () => {
            const isAvailable = await echoesContract.isSignatureAvailable(
              signature,
            );
            assert(!isAvailable);
          });

          it('correct event emitted', async () => {
            const newSignature = 'Other name';
            await expect(echoesContractUser.mint(newSignature, 0, 0, 0, 0))
              .to.emit(echoesContract, 'ECHOES__MINTED')
              .withArgs(user.address, 2, newSignature);
          });
        });
      });

      /**
       * @notice Expand
       */
      describe('expand', function() {
        beforeEach(async () => {
          await echoesContractUser.mint('Name of the echo', 0, 0, 0, 0);
        });

        describe('Should revert if any verification fails', function() {
          it("doesn't exist", async () => {
            await expect(echoesContractUser.expand(2)).to.be.revertedWith(
              "'ECHOES__DOES_NOT_EXIST(2)'",
            );
          });
          it('not owner', async () => {
            const expectedOwner = await echoesContract.ownerOf(1);

            await expect(echoesContract.expand(1)).to.be.revertedWith(
              `'ECHOES__NOT_OWNER("${expectedOwner}", "${deployer.address}")'`,
            );
          });
          it('in expansion cooldown', async () => {
            const lastExpansionTimestamp = (await echoesContract.getEcho(1))
              .lastExpansionTimestamp;

            await expect(echoesContractUser.expand(1)).to.be.revertedWith(
              `'ECHOES__IN_EXPANSION_COOLDOWN(${expansionCooldown}, ${lastExpansionTimestamp})'`,
            );
          });
          it('max expansion reached', async () => {
            await echoesContract.setExpansionCooldown(0);
            // Pass two days to get a higher multiplier
            const twoDaysInBlocks = (2 * 24 * 60 * 60) / 13;
            await mineBlocks(twoDaysInBlocks);

            let reached;
            // Expand until max expansion reached
            while (!reached) {
              await echoesContractUser.expand(1);
              reached = (await echoesContract.getEcho(1)).maxExpansionReached;
            }

            // Try to expand again
            await expect(echoesContractUser.expand(1)).to.be.revertedWith(
              `'ECHOES__MAX_EXPANSION_REACHED(1)'`,
            );
          });
        });

        describe('Should successfully expand and update all storage states', function() {
          // maxExpansionReached is correctly set considering the previous test
          it('correct expansionRate', async () => {
            await echoesContract.setExpansionCooldown(0);
            const expansionRate = (await echoesContract.getEcho(1))
              .expansionRate;
            await echoesContractUser.expand(1);
            const newExpansionRate = (await echoesContract.getEcho(1))
              .expansionRate;

            assert.equal(newExpansionRate.toString(), expansionRate.add(1));
          });
          it('correct lastExpansionTimestamp', async () => {
            await echoesContract.setExpansionCooldown(0);
            const tx = await echoesContractUser.expand(1);
            const receipt = await tx.wait(1);
            const lastExpansionTimestamp = (await echoesContract.getEcho(1))
              .lastExpansionTimestamp;

            assert.equal(
              lastExpansionTimestamp.toString(),
              (await receipt.events[0].getBlock()).timestamp.toString(),
            );
          });
          // Correct event emitted
          it('correct event emitted', async () => {
            await echoesContract.setExpansionCooldown(0);
            const signature = (await echoesContract.getEcho(1)).signature;

            await expect(echoesContractUser.expand(1))
              .to.emit(echoesContract, 'ECHOES__EXPANDED')
              .withArgs(user.address, 1, signature)
              .and.to.emit(echoesContract, 'MetadataUpdate')
              .withArgs(1);
          });
        });
      });

      /**
       * @notice Other untested getters
       */
      describe('getAttributeIndex', function() {
        it('Should return the correct index', async () => {
          for (let i = 0; i < attributes.length; i++) {
            for (let j = 0; j < attributes[i].length; j++) {
              const index = await echoesContract.getAttributeIndex(
                i,
                attributes[i][j],
              );

              assert.equal(index, j);
            }
          }
        });

        it('Should return the first one if the attribute does not exist', async () => {
          const indexNotAttribute = await echoesContract.getAttributeIndex(
            0,
            'Not an attribute',
          );
          assert.equal(indexNotAttribute, 0);

          const indexNotIndex = await echoesContract.getAttributeIndex(
            attributes.length,
            attributes[1][2],
          );
          assert.equal(indexNotIndex, 0);
        });
      });

      describe('getUsedSignatures', function() {
        it('Should return the correct array', async () => {
          const signature1 = 'Signature 1';
          const signature2 = 'Signature 2';

          await echoesContractUser.mint(signature1, 0, 0, 0, 0);
          await echoesContractUser.mint(signature2, 0, 0, 0, 0);

          const usedSignatures = await echoesContract.getUsedSignatures();

          assert.equal(usedSignatures.length, 2);
          assert.equal(usedSignatures[0], signature1);
          assert.equal(usedSignatures[1], signature2);
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
            echoesContract
              .connect(user)
              .addAttributes(newAttributesIndex, newAttributes),
          ).to.be.revertedWith('Ownable: caller is not the owner');
          // setExpansionCooldown
          await expect(
            echoesContract.connect(user).setExpansionCooldown(100),
          ).to.be.revertedWith('Ownable: caller is not the owner');
          // setContractURI
          await expect(
            echoesContract.connect(user).setContractURI('test'),
          ).to.be.revertedWith('Ownable: caller is not the owner');
        });
      });

      describe('[dev functions] - addAttributes', function() {
        it('Should revert if the attribute index is out of bounds', async () => {
          await expect(
            echoesContract.addAttributes(attributes.length, newAttributes),
          ).to.be.revertedWith(
            'ECHOES__INVALID_ATTRIBUTE("The attributes type does not exist")',
          );
        });

        it('Should successfully add new attributes to a type and emit the correct event', async () => {
          await expect(
            await echoesContract.addAttributes(
              newAttributesIndex,
              newAttributes,
            ),
          )
            .to.emit(echoesContract, 'ECHOES__ATTRIBUTES_ADDED')
            .withArgs(newAttributesIndex, newAttributes);

          assert.equal(
            (
              await echoesContract.getAttributesOfType(newAttributesIndex)
            ).toString(),
            [...attributes[newAttributesIndex], ...newAttributes].toString(),
          );
        });
      });

      describe('[dev functions] - setExpansionCooldown', function() {
        it('Should successfully set the expansion cooldown and emit the correct event', async () => {
          await expect(
            await echoesContract.setExpansionCooldown(newExpansionCooldown),
          )
            .to.emit(echoesContract, 'ECHOES__EXPANSION_COOLDOWN_UPDATED')
            .withArgs(newExpansionCooldown);

          assert.equal(
            (await echoesContract.getExpansionCooldown()).toString(),
            newExpansionCooldown.toString(),
          );
        });
      });

      const newColorsArray = [
        '000000',
        '1B1B1B',
        '363636',
        '4F4F4F',
        '696969',
        '828282',
      ];

      describe('[dev functions] - setSpectrumColors', function() {
        it('Should successfully set the spectrum colors and emit the correct event', async () => {
          await expect(await echoesContract.setSpectrumColors(newColorsArray))
            .to.emit(echoesContract, 'ECHOES__SPECTRUM_COLORS_UPDATED')
            .withArgs(newColorsArray);

          assert.sameOrderedMembers(
            await echoesContract.getSpectrumColors(),
            newColorsArray,
          );
        });
      });

      describe('[dev functions] - setSceneryColors', function() {
        it('Should successfully set the scenery colors and emit the correct event', async () => {
          await expect(await echoesContract.setSceneryColors(newColorsArray))
            .to.emit(echoesContract, 'ECHOES__SCENERY_COLORS_UPDATED')
            .withArgs(newColorsArray);

          assert.sameOrderedMembers(
            await echoesContract.getSceneryColors(),
            newColorsArray,
          );
        });
      });

      describe('[dev functions] - setContractURI (OpenSea)', function() {
        it('Should successfully update the contract URI and emit the correct event', async () => {
          await expect(await echoesContract.setContractURI('test'))
            .to.emit(echoesContract, 'ECHOES__CONTRACT_URI_UPDATED')
            .withArgs('test');

          assert.equal(await echoesContract.contractURI(), 'test');
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
  assert.equal(json.name, signature + ' #1', 'name');
  // We can't really test the SVG here, so we just check if it exists
  assert(json.image_data.includes('data:image/svg+xml;base64,'), 'image_data');
  assert.equal(json.external_url, externalUrl + tokenId, 'external_url');
  assert.equal(
    json.background_color,
    sceneryColors[attributes[1].indexOf(chosenAttributes[1])],
    'background_color',
  );

  // Animation url
  const expectedAnimationUrl = `${animationUrl}?0=${attributes[0].indexOf(
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
