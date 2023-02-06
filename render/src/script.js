import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import traits from './data/traits.js';
import vertexShaders from './shaders/orb/vertexShaders/index.js';
import fragmentShader from './shaders/orb/fragmentShader.js';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

/// Get the parameters from the URL
// The parameters come as &0=n&1=n&2=n&3=n&4=n
const urlParams = new URLSearchParams(window.location.search)
  .toString()
  .split('&')
  .map((param) => param.split('='));
// which returns [n, n, n, n, n]
const params = {
  spectrum: urlParams[0] ? urlParams[0][1] || 0 : 0,
  scenery: urlParams[1] ? urlParams[1][1] || 0 : 0,
  trace: urlParams[2] ? urlParams[2][1] || 0 : 0,
  atmosphere: urlParams[3] ? urlParams[3][1] || 0 : 0, // Just for information purposes, we won't render audio
  expanse: urlParams[4] ? urlParams[4][1] || 100 : 100,
};

// Get the appropriate properties from the traits
const spectrum = traits[0].values[params.spectrum].vec3; // colorA and colorB
const scenery = traits[1].values[params.scenery].hex; // background
const trace = traits[2].values[params.trace].id; // vertexShader name
const expanse = params.expanse; // particle count

// Set the background color
document.body.style.backgroundColor = scenery;

// Create the orb
const radius = 2;
// Particles
const particlesPositions = new Float32Array(expanse * 3);

for (let i = 0; i < expanse; i++) {
  const d = Math.sqrt(Math.random() - 0.5) * radius;
  const th = THREE.MathUtils.randFloatSpread(360);
  const phi = THREE.MathUtils.randFloatSpread(360);

  let x = d * Math.sin(th) * Math.cos(phi);
  let y = d * Math.sin(th) * Math.sin(phi);
  let z = d * Math.cos(th);

  particlesPositions.set([x, y, z], i * 3);
}

// Uniforms
const uniforms = {
  uTime: { value: 0.0 },
  uRadius: { value: radius },
  uColorA: new THREE.Uniform(new THREE.Vector3(...spectrum.colorA)),
  uColorB: new THREE.Uniform(new THREE.Vector3(...spectrum.colorB)),
  uGain: { value: 1.0 },
  uBrighten: { value: 1.0 },
};

// Geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(particlesPositions, 3),
);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShaders[trace],
  fragmentShader: fragmentShader,
  uniforms: uniforms,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// Mesh
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

/// Render
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener('resize', () => {
  // Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.enableKeys = false;
// Don't restrict rotation
controls.minPolarAngle = -Infinity;
controls.maxPolarAngle = Infinity;
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
