// Import Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

//directional light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//controls
const controls = new OrbitControls(camera, renderer.domElement);

// Create objects to illuminate
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a plane geometry for the ground
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Create an array to hold multiple disco lights
const discoLights = [];
const numLights = 15; // Number of disco lights

for (let i = 0; i < numLights; i++) {
  const discoLight = new THREE.PointLight(0xffffff, 1, 100);
  scene.add(discoLight);
  discoLights.push(discoLight);
}

// Add an ambient light for some basic illumination
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Function to get a random color
function getRandomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

// Animate the lights
function animate() {
  requestAnimationFrame(animate);
  //controls
  controls.update();

  // Change the color and position of each disco light
  discoLights.forEach((light, index) => {
    // Change the light color randomly
    light.color.setHex(`0x${getRandomColor()}`);

    // Move the light in a circular path
    const time = Date.now() * 0.001;
    light.position.x = Math.sin(time * (index + 1)) * 3;
    light.position.y = Math.sin(time * (index + 2)) * 2;
    light.position.z = Math.cos(time * (index + 1)) * 3;
  });

  // Render the scene
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
