# Orbs - a contemplative yet interactive collectible.

Just a carefully programmed contemplative entity, made of particles.

Each can take one of 3072 unique combinations, even though the purpose might just be to explore the possibilities on the website, and keep it as a pleasant immersive experience.

## Motivation

Everything is available both on testnet and mainnet, as it should be for anything that is part of a learning process - if not for anything that includes a gamified or interactive aspect.

While this demonstrates only basic interactions between the orbs and their very minimalistic soundscape, as well as with the user, it is a good starting point for more complex interactions. Some ideas include:

- Evolving soundscapes, based on the particles count, that would progressively change the orb's atmosphere.
- Orb-to-orb interactions, such as the orbs being able to attract or repel each other, or even merge - as well as affecting each other's atmosphere, or each other _through_ their atmosphere.
- Collaborative soundscapes, where the orbs would be able to play sounds together, or even create new sounds (?) based on their interactions, or affinities.

## How it works

Each has different attributes, such as colors (spectrum), background (scenery), a movement pattern for the particles (trace) and a soundscape that affects the particles (atmosphere). It allows for

Once generated, the orb will grow in particles with time, as well as from interactions with its creator, and will eventually reach a maximum size.

The contracts leave no place for removing any attribute or changing the orb's appearance, but it is possible to add new traits - which would allow for new orbs to be generated with the new traits. The source code can be cloned to display the orbs on your own, or maybe to try out with your own sounds, colors, etc.

## Repository structure

### `frontend`

Everything related to the frontend, made with Next.js & React Three Fiber.

### `hardhat`

Everything related to the smart contracts, tests and deployments included.

### `render`

Lightweight page, used for rendering the 3D models on plateforms such as OpenSea ; made with Vite & Three.js.

### `subgraph`

Everything related to the subgraph, for indexing and querying contracts events on The Graph.

## Notes

- ERC721 implementation, yet with a dynamic URI, allowing us to update very small parts of the metadata, as well as retrieving real-time timed data for the attributes.

- All the metadata is stored on-chain, and is retrieved on the fly, based on the orb's attributes.
