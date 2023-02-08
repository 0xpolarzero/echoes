import stores from '@/stores';

const LadderGraph = () => {
  const { filteredEchoes } = stores.useGraph();
  return (
    <mesh>
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <meshStandardMaterial attach='material' color='hotpink' />
    </mesh>
  );
};

export default LadderGraph;
