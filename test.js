import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//controls
const controls = new OrbitControls(camera, renderer.domElement);


// Step 2: Create the sphere geometry
const radius = 5;
const widthSegments = 32;
const heightSegments = 32;
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// Step 3: Load textures
const textureLoader = new THREE.TextureLoader();

const texture1 = textureLoader.load('../static/floor/wall/arm.jpg');
const texture2 = textureLoader.load('../textures/snow/color.jpg');

// Step 4: Create materials
const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
const material2 = new THREE.MeshBasicMaterial({ map: texture2 });

const half = geometry.index.count / 2;
geometry.clearGroups(); // Clear existing groups
geometry.addGroup(0, half, 0); // First half with material1
geometry.addGroup(half, half, 1); // Second half with material2

// Step 6: Create the mesh
const materials = [material1, material2];
const sphere = new THREE.Mesh(geometry, materials);

// Step 7: Add the mesh to the scene
scene.add(sphere);

// Set camera position and start the animation loop
camera.position.z = 10;

const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    
    renderer.render(scene, camera);
};

animate();
