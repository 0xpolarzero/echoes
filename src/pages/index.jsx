import dynamic from 'next/dynamic';
import Instructions from '@/components/dom/Instructions';
import Creation from '@/components/canvas/Creation';

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('@/components/canvas/Creation'), {
  ssr: false,
});

// Dom components go here
export default function Page(props) {
  return <Instructions>Instructions</Instructions>;
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <Creation route='/blob' position={[-2, 0, 0]} />;

export async function getStaticProps() {
  return { props: { title: 'Index' } };
}
