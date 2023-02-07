const BASE_COUNT = 100;
const MAX_COUNT = 10_000;

const calculateParticlesCount = (creationTimestamp, expandedCount) => {
  const currentTimestamp = Date.now() / 1000;
  const expansionRate = Number(expandedCount) + 1;

  const count =
    BASE_COUNT +
    expansionRate * ((currentTimestamp - Number(creationTimestamp)) / 1000);

  return count >= MAX_COUNT ? MAX_COUNT : count;
};

export default calculateParticlesCount;
