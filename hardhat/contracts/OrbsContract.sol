// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

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
    using Strings for uint256;
    Counters.Counter private _tokenIds;

    /// Structs
    struct Orb {
        // Base traits
        string signature;
        string spectrum;
        string scenery;
        string trace;
        string atmosphere;
        // Enhanced traits
        uint256 expansion;
        // Dates
        uint256 creationTimestamp;
        uint256 lastEnhancementTimestamp;
        // Id
        uint256 tokenId;
    }

    /// Variables
    address private owner;
    uint256 private immutable i_creationDate;
    uint256 private s_maxExpansion;

    string[] private s_usedSignatures;

    /// Mappings
    mapping(uint256 => Orb) private s_orbs; // tokenId => Orb
    mapping(uint256 => string[]) private s_attributes; // typeIndex => attributes

    /// Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner)
            revert ORBS__NOT_OWNER("Only the owner can call this function");
        _;
    }

    /**
     * @notice Constructor
     * @param _attributesSpectrum An array of strings
     * @param _attributesScenery An array of strings
     * @param _attributesTrace An array of strings
     * @param _attributesAtmosphere An array of strings
     * @param _maxExpansion The max expansion uint (particles count)
     * @dev Add each allowed traits to the mapping on deployment ;
     * additionnal traits can be provided later
     */
    constructor(
        string[] _attributesSpectrum,
        string[] _attributesScenery,
        string[] _attributesTrace,
        string[] _attributesAtmosphere,
        uint256 _maxExpansion
    ) ERC721("Orbs", "ORBS") {
        // Set allowed traits
        s_attributes[0] = _attributesSpectrum;
        s_attributes[1] = _attributesScenery;
        s_attributes[2] = _attributesTrace;
        s_attributes[3] = _attributesAtmosphere;

        // Set max expansion (particles count)
        s_maxExpansion = _maxExpansion;

        // Set creation date
        i_creationDate = block.timestamp;
    }

    // TODO public/external
    function mint() public {
        // TODO check if usedNames
    }

    // TODO enhance/expand
    function enhance(uint256 _tokenId) public {
        // TODO check if the token exists
        // TODO check if the token is owned by the sender
        // TODO check if the token has been enhanced since x
        // TODO check max expansion
    }

    // TODO getTokenURI see name to override??
    function createTokenURI(uint256 _tokenId) internal returns (string memory) {
        // TODO increment expand based on date
    }

    /**
     * @dev Add new allowed traits
     * @param _traitId The index in the mapping
     * @param _traits An array of strings
     */
    function addTraits(
        uint256 _traitId,
        string[] memory _traits
    ) external onlyOwner {
        // If the trait already exists, add the new ones
        if (s_attributes[_traitId].length > 0) {
            for (uint256 i = 0; i < _traits.length; i++) {
                s_attributes[_traitId].push(_traits[i]);
            }
        } else {
            // If the trait does not exist, create it
            s_attributes[_traitId] = _traits;
        }
    }

    /// Setters

    /**
     * @dev Set the max expansion
     * @param _maxExpansion The new max expansion
     */
    function setMaxExpansion(uint256 _maxExpansion) external onlyOwner {
        s_maxExpansion = _maxExpansion;
    }

    /// Verifiers

    /**
     * @dev Check if a signature is available
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

    /// Getters

    /**
     * @dev Get the attributes of a type (0: spectrum, 1: scenery, 2: trace, 3: atmosphere)
     * @param _typeIndex The index in the mapping
     */
    function getAttributesOfType(
        uint256 _typeIndex
    ) public view returns (string[] memory) {
        return s_attributes[_typeIndex];
    }

    /**
     * @dev Check the validity of a trait
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
            revert ORBS__ATTRIBUTE_DOES_NOT_EXIST("Attribute not in the list");

        // Return the attribute
        return attributes[_attributeIndex];
    }

    /**
     * @dev Get the max expansion
     */
    function getMaxExpansion() public view returns (uint256) {
        return s_maxExpansion;
    }

    /**
     * @dev Get the used signatures
     */
    function getUsedSignatures() public view returns (string[] memory) {
        return s_usedSignatures;
    }

    /**
     * @dev Get the creation date
     */
    function getCreationDate() external view returns (uint256) {
        return i_creationDate;
    }

    /**
     * @dev Get the current date
     */
    function currentDate() internal pure returns (uint256) {
        return block.timestamp;
    }
}
