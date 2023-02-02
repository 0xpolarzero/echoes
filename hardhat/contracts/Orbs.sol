// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Import data
import "./data/traits.json";

/**
 * @title Orbs contract
 * @notice This contract is used to interact with the orbs_experience
 * @author polarzero
 */

contract Orbs is ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    uint256 private immutable s_creationDate;
    // TODO also mapping id to creation date
    uint256 private s_maxExpansion;

    string[] private s_usedSignatures;

    // Allowed traits
    mapping(uint256 => string[]) private s_allowedTraits;

    /**
     * @notice Constructor
     * @param _allowedSpectrum An array of strings
     * @param _allowedScenery An array of strings
     * @param _allowedTrace An array of strings
     * @param _allowedAtmosphere An array of strings
     * @dev Add each allowed traits to the mapping on deployment ;
     * additionnal traits can be provided later
     */
    constructor(
        string[] _allowedSpectrum,
        string[] _allowedScenery,
        string[] _allowedTrace,
        string[] _allowedAtmosphere,
        uint256 _maxExpansion
    ) {
        // Set allowed traits
        s_allowedTraits[0] = _allowedSpectrum;
        s_allowedTraits[1] = _allowedScenery;
        s_allowedTraits[2] = _allowedTrace;
        s_allowedTraits[3] = _allowedAtmosphere;

        // Set max expansion (particles count)
        s_maxExpansion = _maxExpansion;

        // Set creation date
        s_creationDate = block.timestamp;
    }

    // TODO public/external
    function mint() public {
        // TODO check if usedNames
    }

    // TODO enhance/expand
    function enhance(_tokenId) public {
        // TODO check if the token exists
        // TODO check if the token is owned by the sender
        // TODO check if the token has been enhanced since x
        // TODO check max expansion
    }

    // TODO getTokenURI see name to override??
    function getUri(uint256 _tokenId) public view returns (string memory) {
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
        if (s_allowedTraits[_traitId].length > 0) {
            for (uint256 i = 0; i < _traits.length; i++) {
                s_allowedTraits[_traitId].push(_traits[i]);
            }
        } else {
            // If the trait does not exist, create it
            s_allowedTraits[_traitId] = _traits;
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
     * @dev Check the validity of a trait
     * @param _traitId The index in the mapping
     * @param _trait The trait to check
     */
    function isTraitValid(
        uint256 _traitId,
        string memory _trait
    ) internal view returns (bool) {
        // Get the allowed traits
        string[] memory allowedTraits = s_allowedTraits[_traitId];

        // Check if the trait is valid
        for (uint256 i = 0; i < allowedTraits.length; i++) {
            if (
                keccak256(abi.encodePacked(allowedTraits[i])) ==
                keccak256(abi.encodePacked(_trait))
            ) {
                return true;
            }
        }

        return false;
    }

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
    }

    /// Getters

    /**
     * @dev Get the allowed traits
     * @param _traitId The index in the mapping
     */
    function getTraits(
        uint256 _traitId
    ) external view returns (string[] memory) {
        return s_allowedTraits[_traitId];
    }

    /**
     * @dev Get the max expansion
     */
    function getMaxExpansion() external view returns (uint256) {
        return s_maxExpansion;
    }

    /**
     * @dev Get the used signatures
     */
    function getUsedSignatures() external view returns (string[] memory) {
        return s_usedSignatures;
    }
}
