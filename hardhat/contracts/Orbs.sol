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

    uint256 private s_maxExpansion;

    // Allowed traits
    mapping(uint256 => string[]) private s_allowedTraits;

    // ! check max expansion
    // ! usedNames & check

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
    }

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
}
