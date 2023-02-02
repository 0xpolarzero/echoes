# 3D spheres collection

- Choose traints on the website, sphere/form on one side and options on the other side.
- On click on an option, change it, and let the user go to another option on click/scroll
- In the end, "Mint" generates a 3D sphere with the chosen options
- It actually mints a NFT with the metadata of the chosen options (make it a nice object with the values shown)
  -> Maybe do something original with that (a card on the color of the nft, maybe prompt to get some kind of name based on the options, a poetic color, ...?)
- Maybe draw a random number on mint (chainlink VRF) that decides whether or not a trait would be "enhanced" (more rare)?
- Based on the number of votes, improve the NFT like enhance it -> more rare -> needs to be written on the NFT as well
  -> Votes/rarity improved (VRF) = glow for instance
  -> Each vote gives a chance to get an enhancement (VRF)
  -> Votes are tracked so users can see who voted for their NFT and maybe give it back
- Mint at a free price (but give other options to pay, but tell it won't change anything)

Custom smart contract that keeps track of the rarity of each trait
Events with traits so it can be catched to display on the website

- On the website, display the creations by fetching the NFTs to get their values
- Latest creations
- Best rated (let the users rate the creations)
- Rarest: rarity of traits based on the number of NFTs minted with the same combination of traits

All in the canva, but need to figure out how to display grid with nfts and their informations in a frame around? On click, display it closer and left to show informations right

Which blockchain? Ethereum = more impact but expensive
-> How to make it that it's cheap to interact (vote, etc)

How to implement something more interesting than just votes, e.g. some daily question that based on the response will improve the NFT in different ways, e.g. good/evil, etc

## What will improve on daily quest

- particles count (e.g. 100 -> 10 000 max)

In the contract
originTime = block.timestamp (in constructor)
minted(mapping id => mintTimestamp)
-> Calculate e.g. canEnhance = (block.timestamp - minted[id] > 1 day)
-> Maybe count improved by n per day, so to getCount = baseCount (the base + enhanced) + additionnalCount (currentTime - mintedTimestamp)

# Features

## Creative features

## Technical

### Backend

- Basic minting contract (ERC721)
- Custom verifications (name, traits, ...)
- Metadata modifications based on traits "enhancements"
- Time-based enhancements
- Indexing events on The Graph

### Frontend

- Minting page (with traits options)
- Fetching, sorting and displaying NFTs (The Graph)
- Interacting with the contract (enhancing)

- Displaying a procedural image based on the changing metadata
