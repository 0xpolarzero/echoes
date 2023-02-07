// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Import formatting functions
import "./Formats.sol";

/**
 * @title Echoes contract
 * @notice This contract is used to interact with echoes
 * @author polarzero
 * @dev This contract is the exact same one as OrbsMainnet, except for three exceptions:
 * - There is no mint limit per wallet
 * - There is no max supply
 * - The echoes are free to mint
 */

/// Errors
error ECHOES__INVALID_ATTRIBUTE(string message);
// Mint
error ECHOES__SIGNATURE_ALREADY_USED(string signature);
// Expand
error ECHOES__DOES_NOT_EXIST(uint256 tokenId);
error ECHOES__NOT_OWNER(address owner, address caller);
error ECHOES__MAX_EXPANSION_REACHED(uint256 tokenId);
error ECHOES__IN_EXPANSION_COOLDOWN(
    uint256 cooldown,
    uint256 lastExpansionTimestamp
);

contract OrbsTestnet is ERC721URIStorage, Ownable {
    /// Libs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// Structs
    struct Echo {
        address owner;
        // Base attributes
        string signature;
        string[] attributes; // spectrum, scenery, trace, atmosphere
        // Systems
        uint256 expansionRate; // will be incremented at each expanse
        uint256 lastExpansionTimestamp;
        uint256 creationTimestamp;
        bool maxExpansionReached; // if the expanse value is equal to the max expanse
        uint256 tokenId;
    }

    /// Constants
    uint256 private constant BASE_EXPANSE = 100;
    uint256 private constant MAX_EXPANSION = 10_000;

    /// Variables
    // Base
    address private immutable i_owner;
    uint256 private immutable i_creationTimestamp;
    // Metadata
    string[] private s_spectrumColors;
    string[] private s_sceneryColors;
    string private i_description;
    string private i_externalUrl;
    string private i_animationUrl;
    string private s_contractUri;
    // Systems
    uint256 private s_expansionCooldown;

    string[] private s_usedSignatures;

    /// Mappings
    mapping(uint256 => Echo) private s_echoes; // tokenId => Echo
    mapping(uint256 => string[]) private s_attributes; // typeIndex => attributes
    mapping(uint256 => uint256) private s_creationBlocks; // tokenId => blockNumber

    /// Events
    // Dev functions
    event ECHOES__ATTRIBUTES_ADDED(uint256 typeIndex, string[] attributes);
    event ECHOES__EXPANSION_COOLDOWN_UPDATED(uint256 cooldown);
    event ECHOES__CONTRACT_URI_UPDATED(string contractUri);
    event ECHOES__SPECTRUM_COLORS_UPDATED(string[] colors);
    event ECHOES__SCENERY_COLORS_UPDATED(string[] colors);
    // Mint
    event ECHOES__MINTED(address owner, uint256 tokenId, string signature);
    // Expand
    event ECHOES__EXPANDED(address owner, uint256 tokenId, string signature);

    /**
     * @notice Constructor
     * @param _attributesSpectrum An array of attributes (strings)
     * @param _attributesScenery An array of attributes (strings)
     * @param _attributesTrace An array of attributes (strings)
     * @param _attributesAtmosphere An array of attributes (strings)
     * @param _spectrumColors An array of colors (strings)
     * @param _sceneryColors An array of colors (strings)
     * @param _metadata An array of metadata (strings): animationUrl, externalUrl, description, contractUri
     * @dev Add each allowed traits to the mapping on deployment ;
     * additionnal traits can be provided later
     */
    constructor(
        string[] memory _attributesSpectrum,
        string[] memory _attributesScenery,
        string[] memory _attributesTrace,
        string[] memory _attributesAtmosphere,
        string[] memory _spectrumColors,
        string[] memory _sceneryColors,
        string[] memory _metadata,
        uint256 _expansionCooldown
    ) ERC721("Echoes", "ECHO") {
        // Set attributes
        s_attributes[0] = _attributesSpectrum;
        s_attributes[1] = _attributesScenery;
        s_attributes[2] = _attributesTrace;
        s_attributes[3] = _attributesAtmosphere;

        // Set metadata for the URI
        i_animationUrl = _metadata[0];
        i_externalUrl = _metadata[1];
        i_description = _metadata[2];
        s_spectrumColors = _spectrumColors;
        s_sceneryColors = _sceneryColors;

        // Contract URI (OpenSea)
        s_contractUri = _metadata[3];

        // Set systems
        s_expansionCooldown = _expansionCooldown;

        // Set base
        i_owner = msg.sender;
        i_creationTimestamp = block.timestamp;
    }

    function mint(
        string memory _signature,
        uint256 _spectrumIndex,
        uint256 _sceneryIndex,
        uint256 _traceIndex,
        uint256 _atmosphereIndex
    ) external {
        // Increment the tokenId
        _tokenIds.increment();

        // Check if the signature is provided
        if (bytes(_signature).length == 0)
            revert ECHOES__INVALID_ATTRIBUTE("Signature is empty");
        // Check if the signature is already used
        if (!isSignatureAvailable(_signature))
            revert ECHOES__SIGNATURE_ALREADY_USED(_signature);

        // Get the attributes
        string[] memory attributes = new string[](4);
        attributes[0] = getAttribute(0, _spectrumIndex);
        attributes[1] = getAttribute(1, _sceneryIndex);
        attributes[2] = getAttribute(2, _traceIndex);
        attributes[3] = getAttribute(3, _atmosphereIndex);
        uint256[] memory indexes = new uint256[](4);
        indexes[0] = _spectrumIndex;
        indexes[1] = _sceneryIndex;
        indexes[2] = _traceIndex;
        indexes[3] = _atmosphereIndex;

        // Check if any of the attributes is empty
        for (uint256 i = 0; i < attributes.length; i++) {
            if (bytes(attributes[i]).length == 0)
                revert ECHOES__INVALID_ATTRIBUTE("Wrong attribute provided");
        }

        Echo memory echo = Echo({
            owner: msg.sender,
            signature: _signature,
            attributes: attributes,
            expansionRate: 1,
            lastExpansionTimestamp: currentTimestamp(),
            creationTimestamp: currentTimestamp(),
            maxExpansionReached: false,
            tokenId: _tokenIds.current()
        });

        // Mint the token
        _safeMint(msg.sender, _tokenIds.current());

        // Don't set the tokenURI here, it will be dynamically updated when queried

        // Update storage
        s_usedSignatures.push(_signature);
        s_echoes[_tokenIds.current()] = echo;
        s_creationBlocks[_tokenIds.current()] = block.number;

        emit ECHOES__MINTED(msg.sender, _tokenIds.current(), _signature);
    }

    function expand(uint256 _tokenId) public {
        // Check if the echo exists
        if (!_exists(_tokenId)) revert ECHOES__DOES_NOT_EXIST(_tokenId);

        Echo memory echo = s_echoes[_tokenId];

        // Check if the caller is the owner
        if (msg.sender != echo.owner)
            revert ECHOES__NOT_OWNER(echo.owner, msg.sender);
        // Check if the expansion cooldown is over
        if (
            currentTimestamp() - echo.lastExpansionTimestamp <
            s_expansionCooldown
        )
            revert ECHOES__IN_EXPANSION_COOLDOWN(
                s_expansionCooldown,
                echo.lastExpansionTimestamp
            );
        // Check if the echo has not reached the max expansion
        if (echo.maxExpansionReached)
            revert ECHOES__MAX_EXPANSION_REACHED(echo.tokenId);

        // Update the last expansion timestamp
        s_echoes[_tokenId].lastExpansionTimestamp = currentTimestamp();

        // Update the expansion rate
        s_echoes[_tokenId].expansionRate = echo.expansionRate + 1;

        // Update the maxExpansionReached if needed
        if (getExpanse(echo.tokenId) == MAX_EXPANSION)
            s_echoes[_tokenId].maxExpansionReached = true;

        emit ECHOES__EXPANDED(echo.owner, echo.tokenId, echo.signature);
    }

    /// Getters

    /**
     * @notice Get the token URI for the given tokenId
     * @param _tokenId The tokenId of the echo
     * @dev Override the ERC721 tokenURI function
     * -> This will return the full token URI (concat both strings), with bothe the
     * static and updatable parts
     * -> The expanse will be updated with the current timestamp
     * @return The full token URI in JSON (ERC721 standard)
     */
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        _requireMinted(_tokenId);

        // Get the echo & attributes indexes
        Echo memory echo = s_echoes[_tokenId];
        uint256[] memory indexes = new uint256[](4);
        indexes[0] = getAttributeIndex(0, echo.attributes[0]);
        indexes[1] = getAttributeIndex(1, echo.attributes[1]);
        indexes[2] = getAttributeIndex(2, echo.attributes[2]);
        indexes[3] = getAttributeIndex(3, echo.attributes[3]);

        // Get the appropriate colors
        string[] memory spectrumColors = new string[](2);
        spectrumColors[0] = s_spectrumColors[indexes[0] * 2];
        spectrumColors[1] = s_spectrumColors[indexes[0] * 2 + 1];
        string memory sceneryColor = s_sceneryColors[indexes[1]];

        // Get the base URI (non updatable)
        string memory baseUri = Formats.metadataBase(
            echo.attributes,
            spectrumColors,
            sceneryColor,
            echo.signature,
            i_description,
            i_externalUrl,
            echo.creationTimestamp,
            echo.tokenId
        );

        // Get the expanse (if not maxed)
        uint256 expanse = echo.maxExpansionReached
            ? MAX_EXPANSION
            : getExpanse(echo.tokenId);

        // Get the updatable URI
        string memory updatableUri = Formats.metadataUpdatable(
            i_animationUrl,
            indexes,
            expanse,
            echo.lastExpansionTimestamp,
            echo.maxExpansionReached
        );

        if (bytes(baseUri).length > 0 && bytes(updatableUri).length > 0) {
            // Encode in base64 both parts of the URI
            // This allows users to only update a limited part of the metadata
            // Yet still have the full updated metadata available in the tokenURI
            return Formats.metadataEncode(baseUri, updatableUri);
        }

        return super.tokenURI(_tokenId);
    }

    /**
     * @notice Check if a signature is available
     * @param _signature The signature to check
     */
    function isSignatureAvailable(
        string memory _signature
    ) public view returns (bool) {
        string[] memory usedSignatures = s_usedSignatures;

        for (uint256 i = 0; i < usedSignatures.length; i++) {
            if (
                keccak256(abi.encodePacked(usedSignatures[i])) ==
                keccak256(abi.encodePacked(_signature))
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * @notice Get attributes of a type
     * @param _typeIndex The index in the mapping (to get the attributes)
     */
    function getAttributesOfType(
        uint256 _typeIndex
    ) public view returns (string[] memory) {
        // Get the attributes
        string[] memory attributes = s_attributes[_typeIndex];

        // Check if the attribute exists
        if (attributes.length == 0)
            revert ECHOES__INVALID_ATTRIBUTE(
                "The attributes type does not exist"
            );

        // Return the attribute
        return attributes;
    }

    /**
     *
     * @param _type The type (index) of the attribute (0 = spectrum, 1 = scenery, 2 = trace, 3 = atmosphere)
     * @param _attribute The attribute name (string)
     */
    function getAttributeIndex(
        uint256 _type,
        string memory _attribute
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < s_attributes[_type].length; i++) {
            if (
                keccak256(abi.encodePacked(s_attributes[_type][i])) ==
                keccak256(abi.encodePacked(_attribute))
            ) {
                return i;
            }
        }
        return 0;
    }

    /**
     * @notice Check the validity of a trait
     * @param _typeIndex The index in the mapping (to get the attributes)
     * @param _attributeIndex The index of the attribute to check
     */
    function getAttribute(
        uint256 _typeIndex,
        uint256 _attributeIndex
    ) public view returns (string memory) {
        // Get the attributes
        string[] memory attributes = getAttributesOfType(_typeIndex);

        // Check if the attribute exists
        if (_attributeIndex >= attributes.length)
            revert ECHOES__INVALID_ATTRIBUTE("The attribute does not exist");

        // Return the attribute
        return attributes[_attributeIndex];
    }

    /**
     * @notice Get the expanse of the echo
     * @param _tokenId The tokenId of the echo
     * @dev It could be adapted to read from the tokenId, but it would force to read from storage
     * -> This way it could be fetched from outside the contract more easily as well
     */
    function getExpanse(uint256 _tokenId) public view returns (uint256) {
        // Get the creation block
        uint256 creationBlock = getEchoCreationBlock(_tokenId);
        // Calculate the expanse
        uint256 expanse = BASE_EXPANSE +
            s_echoes[_tokenId].expansionRate *
            ((currentBlockNumber() - creationBlock) / 100); // (~+66 per day)

        // If it reaches the max expanse, return the max expanse
        return expanse >= MAX_EXPANSION ? MAX_EXPANSION : expanse;
    }

    /**
     * @notice Get an echo
     * @param _tokenId The tokenId uint of the echo
     */
    function getOrb(uint256 _tokenId) public view returns (Echo memory) {
        return s_echoes[_tokenId];
    }

    /**
     * @notice Get the creation block number of an echo
     */
    function getEchoCreationBlock(
        uint256 _tokenId
    ) public view returns (uint256) {
        return s_creationBlocks[_tokenId];
    }

    /**
     * @notice Get the expansion cooldown
     */
    function getExpansionCooldown() public view returns (uint256) {
        return s_expansionCooldown;
    }

    /**
     * @notice Get the used signatures
     */
    function getUsedSignatures() public view returns (string[] memory) {
        return s_usedSignatures;
    }

    /**
     * @notice Get the owner
     */
    function getOwner() public view returns (address) {
        return i_owner;
    }

    /**
     * @notice Get the current token ID
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @notice Get the description
     */
    function getDescription() public view returns (string memory) {
        return i_description;
    }

    /**
     * @notice Get the animation URL
     */
    function getAnimationUrl() public view returns (string memory) {
        return i_animationUrl;
    }

    /**
     * @notice Get the external URL
     */
    function getExternalUrl() public view returns (string memory) {
        return i_externalUrl;
    }

    /**
     * @notice Get the spectrum colors
     */
    function getSpectrumColors() public view returns (string[] memory) {
        return s_spectrumColors;
    }

    /**
     * @notice Get the scenery colors
     */
    function getSceneryColors() public view returns (string[] memory) {
        return s_sceneryColors;
    }

    /**
     * @notice Get the creation date
     */
    function getCreationTimestamp() external view returns (uint256) {
        return i_creationTimestamp;
    }

    /**
     * @notice Get the current timestamp
     */
    function currentTimestamp() internal view returns (uint256) {
        return block.timestamp;
    }

    /**
     * @notice Get the current block number
     */
    function currentBlockNumber() internal view returns (uint256) {
        return block.number;
    }

    /**
     * @notice Get the base expanse
     */
    function getBaseExpanse() public pure returns (uint256) {
        return BASE_EXPANSE;
    }

    /**
     * @notice Get the max expanse
     */
    function getMaxExpansion() public pure returns (uint256) {
        return MAX_EXPANSION;
    }

    /// Dev functions

    /**
     * @notice Add new attributes to a type
     * @param _attributeIndex The index in the mapping
     * @param _attributes An array of strings
     * @dev onlyOwner
     */
    function addAttributes(
        uint256 _attributeIndex,
        string[] memory _attributes
    ) external onlyOwner {
        // If the attributes type does not exist, revert (will be done when getting the attributes)
        // It would be too much of a struggle to add a new type and recursively update all echoes
        getAttributesOfType(_attributeIndex);

        // We won't check if the individual attributes already exist either, it would be too expensive
        // It needs to be carefully checked by the owner
        for (uint256 i = 0; i < _attributes.length; i++) {
            s_attributes[_attributeIndex].push(_attributes[i]);
        }

        emit ECHOES__ATTRIBUTES_ADDED(_attributeIndex, _attributes);
    }

    /**
     * @notice Set the expansion cooldown
     * @param _expansionCooldown The new expansion cooldown
     * @dev onlyOwner
     */
    function setExpansionCooldown(
        uint256 _expansionCooldown
    ) external onlyOwner {
        s_expansionCooldown = _expansionCooldown;

        emit ECHOES__EXPANSION_COOLDOWN_UPDATED(_expansionCooldown);
    }

    /**
     * @notice Set the spectrum colors
     * @param _spectrumColors The new spectrum colors (string array)
     * @dev onlyOwner
     */
    function setSpectrumColors(
        string[] memory _spectrumColors
    ) external onlyOwner {
        s_spectrumColors = _spectrumColors;

        emit ECHOES__SPECTRUM_COLORS_UPDATED(_spectrumColors);
    }

    /**
     * @notice Set the scenery colors
     * @param _sceneryColors The new scenery colors (string array)
     * @dev onlyOwner
     */
    function setSceneryColors(
        string[] memory _sceneryColors
    ) external onlyOwner {
        s_sceneryColors = _sceneryColors;

        emit ECHOES__SCENERY_COLORS_UPDATED(_sceneryColors);
    }

    /**
     * OpenSea
     */
    function setContractURI(string memory _contractUri) external onlyOwner {
        s_contractUri = _contractUri;

        emit ECHOES__CONTRACT_URI_UPDATED(_contractUri);
    }

    /// @dev Notice the uppercased `URI` in the function name (for OpenSea to find it)
    /// the rest of the contract prefers a lowercased `uri` / `xUri`
    function contractURI() public view returns (string memory) {
        return s_contractUri;
    }
}
