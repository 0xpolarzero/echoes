# Contracts

- Only 1 orb per wallet Maybe supply limit on mainnet and not on mumbai?

- Use '\_setTokenURI' to update after enhancement

```solidity
function train(uint256 tokenId) public {
    require(_exists(tokenId), "Please use an existing token");
    require(ownerOf(tokenId) == msg.sender, "You must own this token to train it");
    uint256 currentLevel = tokenIdToLevels[tokenId];
    tokenIdToLevels[tokenId] = currentLevel + 1;
    _setTokenURI(tokenId, getTokenURI(tokenId));
}
```

- Verify the metadata in the contract (if belongs to existing names)

- How to check that a name was not taken when minting? Where to put that array of names?
  -> Faire une array usedNames, dans laquelle c'est push à chaque fois, et qui verifie que le nom n'est pas dedans avant de mint

https://levelup.gitconnected.com/how-to-create-an-interactive-nft-4aeeed979138

! Emit event when metadata updated to refresh OpenSea (end https://docs.opensea.io/docs/metadata-standards)
event MetadataUpdate(uint256 \_tokenId)
