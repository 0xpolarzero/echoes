// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Import formatting functions
import "./Formats.sol";

/**
 * @title Orbs contract
 * @notice This contract is used to interact with orbs
 * @author polarzero
 */

/// Errors
error ORBS__NOT_OWNER(string message);
error ORBS__ATTRIBUTE_DOES_NOT_EXIST(string message);

contract OrbsContract is ERC721URIStorage {
    /// Libs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// Structs
    struct Orb {
        // Base attributes
        string signature;
        uint256 spectrumIndex;
        uint256 sceneryIndex;
        uint256 traceIndex;
        uint256 atmosphereIndex;
        // Systems
        uint256 expansionMultiplier; // will be incremented at each expansion
        uint256 lastExpansionTimestamp;
        uint256 creationTimestamp;
        bool maxExpansionReached; // if the expansion value is equal to the max expansion
        // Id
        uint256 tokenId;
    }

    /// Constants
    uint256 private constant BASE_EXPANSION = 100;
    uint256 private constant MAX_EXPANSION = 10_000;
    uint256 private constant MAX_SUPPLY = 1_000;

    /// Variables
    // Base
    address private immutable i_owner;
    uint256 private immutable i_creationTimestamp;
    // Metadata
    bytes3 private immutable i_backgroundColor;
    string private i_description;
    string private i_externalUrl;
    string private i_animationUrl;
    // Systems
    uint256 private s_expansionCooldown;

    string[] private s_usedSignatures;

    /// Mappings
    mapping(uint256 => Orb) private s_orbs; // tokenId => Orb
    mapping(uint256 => string[]) private s_attributes; // typeIndex => attributes

    /// Events
    // Dev functions
    event ORBS__ATTRIBUTES_ADDED(uint256 typeIndex, string[] attributes);
    event ORBS__EXPANSION_COOLDOWN_UPDATED(uint256 cooldown);

    /// Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner)
            revert ORBS__NOT_OWNER("Only the owner can call this function");
        _;
    }

    /**
     * @notice Constructor
     * @param _attributesSpectrum An array of strings
     * @param _attributesScenery An array of strings
     * @param _attributesTrace An array of strings
     * @param _attributesAtmosphere An array of strings
     * @param _description The description for the URI (string)
     * @param _animationUrl The animation URL for the URI (string)
     * @param _externalUrl The external URL for the URI (string)
     * @param _backgroundColor The background color for the URI (bytes32)
     * @dev Add each allowed traits to the mapping on deployment ;
     * additionnal traits can be provided later
     */
    constructor(
        string[] memory _attributesSpectrum,
        string[] memory _attributesScenery,
        string[] memory _attributesTrace,
        string[] memory _attributesAtmosphere,
        string memory _animationUrl,
        string memory _description,
        string memory _externalUrl,
        bytes3 _backgroundColor,
        uint256 _expansionCooldown
    ) ERC721("Orbs", "ORBS") {
        // Set attributes
        s_attributes[0] = _attributesSpectrum;
        s_attributes[1] = _attributesScenery;
        s_attributes[2] = _attributesTrace;
        s_attributes[3] = _attributesAtmosphere;

        // Set metadata for the URI
        i_externalUrl = _externalUrl;
        i_animationUrl = _animationUrl;
        i_description = _description;
        i_backgroundColor = _backgroundColor;

        // Set systems
        s_expansionCooldown = _expansionCooldown;

        // Set base
        i_owner = msg.sender;
        i_creationTimestamp = block.timestamp;
    }

    // TODO public/external
    function mint() public {
        // TODO check if usedSignatures
        // TODO maybe check if already minted if limit for user
        // TODO if max supply check + same for value
        // TODO write to s_orbs
        // TODO write to s_usedSignatures
        // TODO do both _setTokenURI and setTokenURIUpdatable
    }

    // TODO enhance/expand
    function enhance(uint256 _tokenId) public {
        // TODO check if the token exists
        // TODO check if the token is owned by the sender
        // TODO check if the token has been enhanced since x
        // TODO check max expansion
        // TODO write to s_orbs
        // TODO only do setTokenURIUpdatable
    }

    /// Getters

    /**
     * @notice Get the token URI
     * @param _tokenId The tokenId uint to get the URI
     * @dev Builds the metadata for the collectible
     * -> It will only return the metadata that won't be updated
     * @return The token URI (string) in JSON format (ERC721 standard)
     */
    function getTokenUri(
        uint256 _tokenId
    ) internal view returns (string memory) {
        // Get the attributes
        Orb memory orb = s_orbs[_tokenId];
        string[] memory attributes = new string[](4);
        attributes[0] = getAttributesOfType(0)[orb.spectrumIndex];
        attributes[1] = getAttributesOfType(1)[orb.sceneryIndex];
        attributes[2] = getAttributesOfType(2)[orb.traceIndex];
        attributes[3] = getAttributesOfType(3)[orb.atmosphereIndex];

        // Build the metadata in the ERC721 format
        return
            Formats.formatMetadata(
                attributes,
                orb.signature,
                i_description,
                i_externalUrl,
                i_backgroundColor,
                orb.creationTimestamp,
                _tokenId
            );
    }

    /**
     * @notice Get the token URI updatable
     * @param _tokenId The tokenId uint to get the URI
     * @dev Builds the metadata for the collectible
     * -> It will only return the metadata that will be updated
     * @return The token URI (string) in JSON format (ERC721 standard)
     */
    function getTokenUriUpdatable(
        uint256 _tokenId
    ) internal view returns (string memory) {
        Orb memory orb = s_orbs[_tokenId];

        // Get the expansion (if not maxed)
        uint256 expansion = orb.maxExpansionReached
            ? MAX_EXPANSION
            : getExpansion(_tokenId);

        // Build the metadata in the ERC721 format
        return
            Formats.formatMetadataUpdatable(
                i_animationUrl,
                orb.spectrumIndex,
                orb.sceneryIndex,
                orb.traceIndex,
                orb.atmosphereIndex,
                expansion,
                orb.lastExpansionTimestamp,
                orb.maxExpansionReached
            );
    }

    /**
     * @notice Check if a signature is available
     * @param _signature The signature to check
     */
    function isSignatureAvailable(
        string memory _signature
    ) internal view returns (bool) {
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
     * @notice Get the attributes of a type (0: spectrum, 1: scenery, 2: trace, 3: atmosphere)
     * @param _typeIndex The index in the mapping
     */
    function getAttributesOfType(
        uint256 _typeIndex
    ) public view returns (string[] memory) {
        return s_attributes[_typeIndex];
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
            revert ORBS__ATTRIBUTE_DOES_NOT_EXIST(
                "The attribute type does not exist"
            );

        // Return the attribute
        return attributes[_attributeIndex];
    }

    /**
     * @notice Get the expansion of the orb
     * @param _tokenId The tokenId uint of the orb
     */
    function getExpansion(uint256 _tokenId) public view returns (uint256) {
        uint256 maxExpansion = getMaxExpansion();
        // Calculate the expansion
        uint256 expansion = s_orbs[_tokenId].expansionMultiplier * maxExpansion;

        // If it reaches the max expansion, return the max expansion
        if (expansion >= maxExpansion) return maxExpansion;

        return expansion;
    }

    /**
     * @notice Get an orb
     * @param _tokenId The tokenId uint of the orb
     */
    function getOrb(uint256 _tokenId) public view returns (Orb memory) {
        return s_orbs[_tokenId];
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
     * @notice Get the creation date
     */
    function getCreationTimestamp() external view returns (uint256) {
        return i_creationTimestamp;
    }

    /**
     * @notice Get the current date
     */
    function currentDate() internal view returns (uint256) {
        return block.timestamp;
    }

    /**
     * @notice Get the base expansion
     */
    function getBaseExpansion() public pure returns (uint256) {
        return BASE_EXPANSION;
    }

    /**
     * @notice Get the max expansion
     */
    function getMaxExpansion() public pure returns (uint256) {
        return MAX_EXPANSION;
    }

    /**
     * @notice Get the max supply
     */
    function getMaxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
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
        // If the attributes type does not exist, revert
        // It would be too much of a struggle to add a new type and recursively update all orbs
        if (getAttributesOfType(_attributeIndex).length == 0) {
            revert ORBS__ATTRIBUTE_DOES_NOT_EXIST(
                "The attribute type does not exist"
            );
            // If the trait already exists, add the new ones
        } else {
            // We won't check if the attributes already exist, it would be too expensive
            // It needs to be carefully checked by the owner
            for (uint256 i = 0; i < _attributes.length; i++) {
                s_attributes[_attributeIndex].push(_attributes[i]);
            }

            emit ORBS__ATTRIBUTES_ADDED(_attributeIndex, _attributes);
        }
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

        emit ORBS__EXPANSION_COOLDOWN_UPDATED(_expansionCooldown);
    }
}
