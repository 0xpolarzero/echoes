### Echoes - hardhat

Everything can be cloned and run locally, though the easiest way to get started is to visit the [website](https://echoes.polarzero.xyz).

## Features

- Basic minting contract (ERC721)
- Custom verifications (name, traits, ...)
- Metadata modifications based on traits enhancements (`expansion`)
- Time-based enhancements
- Indexing events on The Graph
- **Limited tokenURI modifications (only modifies the necessary attributes) for cheaper and more efficient metadata updates**
- **Modification of ERC721 tokenURI implementation to dynamically get the URI based on constantly changing metadata (e.g. timestamp)**
  -> + the animation url always returns updated traits to display the Three.js scene

## How to deploy your own

### Clone & install

```bash
# Clone the repository
git clone git@github.com:polar0/echoes.git

# Install dependencies
cd echoes/hardhat
yarn

# Copy the .env file and populate it (see .env.example)
cp .env.example .env.local
```

### Run tests

```bash
# Run all unit tests
yarn hardhat test

# Test coverage
yarn hardhat coverage
```

### Deploy the contracts

```bash
yarn hardhat deploy

# Or if you want to deploy to a specific network
yarn hardhat deploy --network <network>
```
