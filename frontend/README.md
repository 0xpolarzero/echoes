# Echoes - frontend

Everything can be cloned and run locally, though the easiest way to get started is to visit the [website](https://echoes.polarzero.xyz).

Echoes can be generated on testnets (Goerli, Polygon Mumbai, Arbitrum Goerli). The functionalities are exactly the same, so you can choose your playground based on your network of choice.

## How to run locally

```bash
# Clone the repository
git clone git@github.com:polar0/echoes.git

# Install dependencies
cd echoes/frontend
yarn

# Copy the .env.local file and populate it (see .env.example)
cp .env.example .env.local
# The subgraphs URLs are provided in the .env.example file, but you can replace them with your own, if you want to use your own subgraphs.

# Run the development server
yarn dev
```
