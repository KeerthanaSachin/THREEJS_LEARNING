import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

// Scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gui = new GUI();

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;
camera.position.x = 4;
camera.position.y = 2;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Directional light 
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1).normalize();
scene.add(directionalLight2);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const floorAlphaTexture = textureLoader.load('../static/floor/alpha.jpg');
const floorColorTexture = textureLoader.load('../textures/snow/color.jpg');
const floorARMTexture = textureLoader.load('../textures/snow/arm.jpg');
const floorNormalTexture = textureLoader.load('../textures/snow/normal.jpg');
const floorDisplacementTexture = textureLoader.load('../textures/snow/disp.jpg');

// Set texture properties
floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

const wallARMTexture = textureLoader.load('../static/floor/wall/arm.jpg');
const wallColorTexture = textureLoader.load('../static/floor/wall/color.jpg');
const wallNormalTexture = textureLoader.load('../static/floor/wall/normal.jpg');

wallNormalTexture.repeat.set(4, 4);
wallNormalTexture.wrapS = THREE.RepeatWrapping;
wallNormalTexture.wrapT = THREE.RepeatWrapping;

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Load snow tree
const loader = new GLTFLoader();
loader.load('./snowtree/snowtree.gltf', function (gltf) {
    const tree = gltf.scene;
    tree.scale.set(0.1, 0.1, 0.1);
    tree.position.set(3, -1.6, 0);
    scene.add(tree);

    for (let i = 0; i < 100; i++) {
        const treeClone = tree.clone();
        treeClone.position.set(
            (Math.random() - 0.5) * 20,
            -1.6,
            (Math.random() - 0.5) * 20
        );
        scene.add(treeClone);
    }
});

// Create an igloo
const iglooGeometry = new THREE.SphereGeometry(1, 32, 32);
const iglooMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    normalMap: wallNormalTexture,
});
const igloo = new THREE.Mesh(iglooGeometry, iglooMaterial);
igloo.position.set(0, -1.6, 0);
scene.add(igloo);

const miniGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const mini = new THREE.Mesh(miniGeometry, iglooMaterial);
mini.position.set(0, -1.6, 0.9);
scene.add(mini);

const doorGeometry = new THREE.PlaneGeometry(0.1, 0.09);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, -1.44, 1.38);
//door.rotation.set(0, 0, -2);
//scene.add(door);

const snowballTexture = textureLoader.load('/textures/snow/1.png');

// Particles
const snowGeometry = new THREE.BufferGeometry();
const count = 500;
const positions = new Float32Array(count * 3);
const speeds = new Float32Array(count);

for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    speeds[i] = Math.random() * 0.02 + 0.01;
}
snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const snowMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: snowballTexture,
    alphaTest: 0.001,
});

const snow = new THREE.Points(snowGeometry, snowMaterial);
scene.add(snow);

// Add a plane for ground
const planeGeometry = new THREE.PlaneGeometry(30, 30, 50, 50);
const planeMaterial = new THREE.MeshPhysicalMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    color: 0xffffff,
    map: floorColorTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.2,
    displacementBias: -0.1,
    normalMap: floorNormalTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.5;
scene.add(plane);

gui.add(plane.material, 'displacementScale').min(0).max(1).step(0.001).name('snowDisplacementScale');
gui.add(plane.material, 'displacementBias').min(-1).max(1).step(0.001).name('snowDisplacementBias');



function createGradientTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Create gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(1, '#FFFFFF'); // White

    // Fill the canvas with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

const gradientTexture = createGradientTexture();
scene.background = gradientTexture;


const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Loop snow particles
    const positions = snowGeometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= speeds[i];
        if (positions[i * 3 + 1] < -1.5) positions[i * 3 + 1] = 10;
    }
    snowGeometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});