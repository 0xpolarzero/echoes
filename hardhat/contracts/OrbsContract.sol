// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Import formatting functions
import "./Formats.sol";

/**
 * @title Orbs contract
 * @notice This contract is used to interact with orbs
 * @author polarzero
 */

/// Errors
error ORBS__INVALID_ATTRIBUTE(string message);
// Dev functions
error ORBS__NOT_OWNER(string message);
// Mint
error ORBS__INVALID_PRICE(uint256 value, uint256 price);
error ORBS__MAX_SUPPLY_REACHED(uint256 tokenId);
error ORBS__MINT_LIMIT_REACHED(uint256 mintLimit);
error ORBS__SIGNATURE_ALREADY_USED(string signature);

contract OrbsContract is ERC721URIStorage, Ownable {
    /// Libs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// Structs
    struct Orb {
        // Base attributes
        string signature;
        string[] attributes; // spectrum, scenery, trace, atmosphere
        // Systems
        uint256 expansionMultiplier; // will be incremented at each expansion
        uint256 lastExpansionTimestamp;
        uint256 creationTimestamp;
        bool maxExpansionReached; // if the expansion value is equal to the max expansion
        uint256 tokenId;
    }

    /// Constants
    uint256 private constant BASE_EXPANSION = 100;
    uint256 private constant MAX_EXPANSION = 10_000;

    /// Variables
    // Base
    address private immutable i_owner;
    uint256 private immutable i_creationTimestamp;
    uint256 private immutable i_maxSupply; // 1_000
    uint256 private s_price;
    uint256 private s_mintLimit;
    // Metadata
    uint256 private immutable i_backgroundColor;
    string private i_description;
    string private i_externalUrl;
    string private i_animationUrl;
    string private s_contractUri;
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
    event ORBS__PRICE_UPDATED(uint256 price);
    event ORBS__MINT_LIMIT_UPDATED(uint256 mintLimit);
    // Mint
    event ORBS__MINTED(Orb orb);

    /**
     * @notice Constructor
     * @param _attributesSpectrum An array of strings
     * @param _attributesScenery An array of strings
     * @param _attributesTrace An array of strings
     * @param _attributesAtmosphere An array of strings
     * @param _description The description for the URI (string)
     * @param _animationUrl The animation URL for the URI (string)
     * @param _externalUrl The external URL for the URI (string)
     * @param _backgroundColor The background color for the URI (uint256)
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
        string memory _contractUri,
        uint256 _backgroundColor,
        uint256 _expansionCooldown,
        uint256[] memory _base // price, mintLimit, maxSupply
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

        // Contract URI (OpenSea)
        s_contractUri = _contractUri;

        // Set systems
        s_expansionCooldown = _expansionCooldown;

        // Set base
        i_owner = msg.sender;
        i_creationTimestamp = block.timestamp;
        s_price = _base[0];
        s_mintLimit = _base[1]; // 0 = no limit
        i_maxSupply = _base[2]; // Easier to set here than constant - for testing purpose
    }

    // TODO public/external
    function mint(
        string memory _signature,
        uint256 _spectrumIndex,
        uint256 _sceneryIndex,
        uint256 _traceIndex,
        uint256 _atmosphereIndex
    ) public payable {
        // Increment the tokenId
        _tokenIds.increment();

        // Check if enough value is sent
        if (msg.value < s_price) revert ORBS__INVALID_PRICE(msg.value, s_price);
        // Check if the user has not reached the mint limit
        if (s_mintLimit != 0 && balanceOf(msg.sender) >= s_mintLimit)
            revert ORBS__MINT_LIMIT_REACHED(s_mintLimit);
        // Check if max supply is reached
        if (_tokenIds.current() > i_maxSupply)
            revert ORBS__MAX_SUPPLY_REACHED(i_maxSupply);
        // Check if the signature is provided
        if (bytes(_signature).length == 0)
            revert ORBS__INVALID_ATTRIBUTE("Signature is empty");
        // Check if the signature is already used
        if (!isSignatureAvailable(_signature))
            revert ORBS__SIGNATURE_ALREADY_USED(_signature);

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
                revert ORBS__INVALID_ATTRIBUTE("Wrong attribute provided");
        }

        Orb memory orb = Orb({
            signature: _signature,
            attributes: attributes,
            expansionMultiplier: 1,
            lastExpansionTimestamp: block.timestamp,
            creationTimestamp: block.timestamp,
            maxExpansionReached: false,
            tokenId: _tokenIds.current()
        });

        // Mint the token
        _safeMint(msg.sender, _tokenIds.current());

        // Set the full token URI (concat both strings)
        // string memory tokenUri = string.concat(
        //     getTokenUri(orb),
        //     getTokenUriUpdatable(orb, indexes)
        // );
        // _setTokenURI(_tokenIds.current(), tokenUri);

        // Update storage
        s_usedSignatures.push(_signature);
        s_orbs[_tokenIds.current()] = orb;

        emit ORBS__MINTED(orb);
    }

    // Or maybe override function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
    // to just get both strings and concat them
    function tokenURI(
        uint256 _tokenId
    )
        public
        view
        override
        returns (
            // virtual
            string memory
        )
    {
        _requireMinted(_tokenId);

        // string memory _tokenURI = _tokenURIs[_tokenId];
        // string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        // if (bytes(base).length == 0) {
        //     return _tokenURI;
        // }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        Orb memory orb = s_orbs[_tokenId];
        uint256[] memory indexes = new uint256[](4);
        indexes[0] = getAttributeIndex(0, orb.attributes[0]);
        indexes[1] = getAttributeIndex(1, orb.attributes[1]);
        indexes[2] = getAttributeIndex(2, orb.attributes[2]);
        indexes[3] = getAttributeIndex(3, orb.attributes[3]);

        if (
            bytes(
                string.concat(
                    getTokenUri(orb),
                    getTokenUriUpdatable(orb, indexes)
                )
            ).length > 0
        ) {
            // Encode in base64 both parts of the URI
            // This allows users to only update a limited part of the metadata
            // Yet still have the full updated metadata available in the tokenURI
            return
                Formats.metadataEncode(
                    getTokenUri(orb),
                    getTokenUriUpdatable(orb, indexes)
                );
        }

        return super.tokenURI(_tokenId);
    }

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

    // TODO enhance/expand
    function enhance(uint256 _tokenId) public {
        // TODO check if the token exists
        // TODO check if the token is owned by the sender
        // TODO check if the token has been enhanced since x
        // TODO check max expansion
        // TODO write to s_orbs
        // TODO only do setTokenURIUpdatable
        // TODO emit MetadataUpdate(uint256 _tokenId) (for OpenSea)
    }

    /// Getters

    /**
     * @notice Get the token URI
     * @param _orb The Orb struct populated with the new data
     * @dev Builds the metadata for the collectible
     * -> It will only return the metadata that won't be updated
     * @return The token URI (string) in JSON format (ERC721 standard)
     */
    function getTokenUri(
        Orb memory _orb
    ) internal view returns (string memory) {
        // Build the metadata in the ERC721 format
        return (
            Formats.metadataBase(
                _orb.attributes,
                _orb.signature,
                i_description,
                i_externalUrl,
                i_backgroundColor,
                _orb.creationTimestamp,
                _orb.tokenId
            )
        );
    }

    /**
     * @notice Get the token URI updatable
     * @param _orb The Orb struct populated with the new or fetched data
     * @dev Builds the metadata for the collectible
     * -> It will only return the metadata that will be updated
     * @return The token URI (string) in JSON format (ERC721 standard)
     */
    function getTokenUriUpdatable(
        Orb memory _orb,
        uint256[] memory _indexes
    ) internal view returns (string memory) {
        // Get the expansion (if not maxed)
        uint256 expansion = _orb.maxExpansionReached
            ? MAX_EXPANSION
            : getExpansion(_orb.tokenId);

        // Build the metadata in the ERC721 format
        return
            Formats.metadataUpdatable(
                i_animationUrl,
                _indexes,
                expansion,
                _orb.lastExpansionTimestamp,
                _orb.maxExpansionReached
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
            revert ORBS__INVALID_ATTRIBUTE(
                "The attributes type does not exist"
            );

        // Return the attribute
        return attributes;
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
            revert ORBS__INVALID_ATTRIBUTE("The attribute does not exist");

        // Return the attribute
        return attributes[_attributeIndex];
    }

    /**
     * @notice Get the expansion of the orb
     * @param _tokenId The tokenId uint of the orb
     */
    function getExpansion(uint256 _tokenId) public view returns (uint256) {
        // Calculate the expansion
        uint256 expansion = s_orbs[_tokenId].expansionMultiplier *
            BASE_EXPANSION;

        // If it reaches the max expansion, return the max expansion
        return expansion >= MAX_EXPANSION ? MAX_EXPANSION : expansion;
    }

    /**
     * @notice Get an orb
     * @param _tokenId The tokenId uint of the orb
     */
    function getOrb(uint256 _tokenId) public view returns (Orb memory) {
        return s_orbs[_tokenId];
    }

    /**
     * @notice Get the price of the orb
     */
    function getPrice() public view returns (uint256) {
        return s_price;
    }

    /**
     * @notice Get the mint limit
     */
    function getMintLimit() public view returns (uint256) {
        return s_mintLimit;
    }

    /**
     * @notice Get the max supply
     */
    function getMaxSupply() public view returns (uint256) {
        return i_maxSupply;
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
        // It would be too much of a struggle to add a new type and recursively update all orbs
        getAttributesOfType(_attributeIndex);

        // We won't check if the individual attributes already exist either, it would be too expensive
        // It needs to be carefully checked by the owner
        for (uint256 i = 0; i < _attributes.length; i++) {
            s_attributes[_attributeIndex].push(_attributes[i]);
        }

        emit ORBS__ATTRIBUTES_ADDED(_attributeIndex, _attributes);
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

    /**
     * @notice Set the price
     * @param _price The new price
     * @dev onlyOwner
     */
    function setPrice(uint256 _price) external onlyOwner {
        s_price = _price;

        emit ORBS__PRICE_UPDATED(_price);
    }

    /**
     * @notice Set the mint limit
     * @param _mintLimit The new mint limit
     * @dev onlyOwner
     */
    function setMintLimit(uint256 _mintLimit) external onlyOwner {
        s_mintLimit = _mintLimit;

        emit ORBS__MINT_LIMIT_UPDATED(_mintLimit);
    }

    /**
     * OpenSea
     */
    function setContractURI(string memory _contractUri) external onlyOwner {
        s_contractUri = _contractUri;
    }

    function contractURI() public view returns (string memory) {
        return s_contractUri;
    }
}
